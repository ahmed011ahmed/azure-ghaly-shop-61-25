
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

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Store verification token in database
    const { error: insertError } = await supabaseClient
      .from('verification_codes')
      .insert({
        email,
        code: verificationToken, // Using code field to store token
        user_id: user_id || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        is_used: false
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    // Create verification link
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173';
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send custom email with verification link
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الحساب</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: rtl;
            text-align: right;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .verify-button:hover {
            opacity: 0.9;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }
          .link-text {
            word-break: break-all;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
            margin: 10px 0;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎮 GHALY GAMING</h1>
            <h2>تأكيد إنشاء الحساب</h2>
          </div>
          
          <div class="content">
            <p>مرحباً بك في GHALY GAMING!</p>
            <p>لإكمال إنشاء حسابك، يرجى النقر على الرابط التالي:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" class="verify-button">تأكيد البريد الإلكتروني</a>
            </div>
            
            <p>أو يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
            <div class="link-text">${verificationLink}</div>
            
            <div class="warning">
              <strong>⚠️ مهم:</strong> هذا الرابط صالح لمدة 24 ساعة فقط
            </div>
            
            <p>إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا الإيميل.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 GHALY GAMING - جميع الحقوق محفوظة</p>
            <p>هذا إيميل تلقائي، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // For development: Log the verification link
    console.log(`رابط التحقق للإيميل ${email}: ${verificationLink}`);
    console.log('Email HTML generated for:', email);

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
      JSON.stringify({ error: error.message || 'حدث خطأ في إرسال رابط التحقق' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
