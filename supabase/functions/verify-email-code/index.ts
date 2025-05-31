
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

    const { email, code } = await req.json();

    console.log('Verifying code for email:', email);

    // Check verification code
    const { data: verificationData, error: verifyError } = await supabaseClient
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verificationData) {
      console.error('Verification failed:', verifyError);
      return new Response(
        JSON.stringify({ error: 'كود التأكيد غير صحيح أو منتهي الصلاحية' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark code as used
    const { error: updateError } = await supabaseClient
      .from('verification_codes')
      .update({ is_used: true })
      .eq('id', verificationData.id);

    if (updateError) {
      console.error('Error marking code as used:', updateError);
      throw updateError;
    }

    // Update user email verification status if user_id exists
    if (verificationData.user_id) {
      const { error: authUpdateError } = await supabaseClient.auth.admin.updateUserById(
        verificationData.user_id,
        { email_confirm: true }
      );

      if (authUpdateError) {
        console.error('Error confirming user email:', authUpdateError);
        throw authUpdateError;
      }
    }

    console.log('Email verification successful for:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-email-code:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'حدث خطأ في تأكيد كود التحقق' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
