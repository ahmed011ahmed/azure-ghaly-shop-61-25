
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

    const { email, user_id } = await req.json();

    console.log('Received request:', { email, user_id });

    if (!email) {
      throw new Error('Email is required');
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Store verification token in database
    const { error: insertError } = await supabaseClient
      .from('verification_codes')
      .insert({
        email,
        code: verificationToken,
        user_id: user_id || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_used: false
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Create verification link
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173';
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // For development: Log the verification link
    console.log(`رابط التحقق للإيميل ${email}: ${verificationLink}`);

    // In production, you would use an email service like Resend here
    // For now, we'll simulate successful email sending
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'تم إرسال رابط التحقق بنجاح',
        emailSent: true,
        verificationLink: verificationLink // For development
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-verification-link:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'حدث خطأ في إرسال رابط التحقق' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
