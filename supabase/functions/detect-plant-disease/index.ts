import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HF_API_KEY = Deno.env.get("HF_API_KEY");
    if (!HF_API_KEY) throw new Error("HF_API_KEY not configured");

    const { imageBase64, cropType } = await req.json();
    if (!imageBase64 || !cropType) {
      return new Response(JSON.stringify({ error: "Missing imageBase64 or cropType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode base64 to binary
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Call Hugging Face image classification model for plant diseases
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: bytes,
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("HF API error:", hfResponse.status, errorText);
      
      // If model is loading, return a specific message
      if (hfResponse.status === 503) {
        return new Response(JSON.stringify({ error: "Model is loading, please try again in 30 seconds." }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const predictions = await hfResponse.json();
    // predictions is an array of { label, score }
    
    // Check if top prediction indicates healthy
    const topPrediction = predictions[0];
    const isHealthy = topPrediction?.label?.toLowerCase().includes("healthy") || 
                      topPrediction?.score < 0.3;

    return new Response(
      JSON.stringify({
        healthy: isHealthy,
        predictions: predictions.slice(0, 5),
        topLabel: topPrediction?.label || "Unknown",
        confidence: topPrediction?.score || 0,
        cropType,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("detect-plant-disease error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
