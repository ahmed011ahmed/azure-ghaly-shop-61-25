
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, code, user_id } = await req.json();

    console.log('Received request:', { email, code, user_id });

    // Store verification code in database
    const { error: insertError } = await supabaseClient
      .from('verification_codes')
      .insert({
        email,
        code,
        user_id: user_id || null,
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        is_used: false
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    // For now, log the verification code (in production, send actual email)
    console.log(`كود التحقق للإيميل ${email}: ${code}`);

    return new Response(
      JSON.stringify({ success: true, message: 'تم إرسال كود التحقق بنجاح' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-verification-code:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'حدث خطأ في إرسال كود التحقق' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
