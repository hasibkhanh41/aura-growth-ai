(function(){
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const cleanText=v=>String(v??'').replace(/<\\/?(h1|h2|h3|h4|p|strong|em|br|ul|ol|li)[^>]*>/gi,' ').replace(/<[^>]*>/g,'').replace(/\\s+/g,' ').trim();
  const css=`
    .aura-live-preview{margin-top:18px;border:1px solid #292d51;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#0d1023,#080a18);box-shadow:0 20px 60px rgba(0,0,0,.28)}
    .aura-live-hero{padding:42px 34px 34px;text-align:center;background:radial-gradient(circle at 50% 0%,rgba(169,0,255,.18),transparent 55%)}
    .aura-live-badge{display:inline-block;padding:6px 10px;border:1px solid rgba(169,0,255,.35);border-radius:999px;color:#d38aff;font-size:10px;font-weight:800;letter-spacing:1px}
    .aura-live-hero h2{max-width:760px;margin:16px auto 10px;font-size:34px;line-height:1.12}
    .aura-live-hero p{max-width:720px;margin:0 auto 22px;color:#aeb4ce;line-height:1.7}
    .aura-live-form{max-width:560px;margin:0 auto;display:flex;gap:10px}
    .aura-live-form input{flex:1;min-width:0;height:48px;padding:0 15px;border:1px solid #292d51;border-radius:11px;background:#080b1b;color:#fff}
    .aura-live-form button,.aura-live-cta{height:48px;padding:0 20px;border:0;border-radius:11px;background:linear-gradient(135deg,#a900ff,#702cff);color:#fff;font-weight:700}
    .aura-live-note{margin-top:10px;color:#6f7594;font-size:10px}
    .aura-live-sections{padding:4px 28px 28px}
    .aura-live-section{padding:24px 6px;border-top:1px solid rgba(255,255,255,.07)}
    .aura-live-section-title{font-size:15px;font-weight:800;margin-bottom:9px}
    .aura-live-section-body{color:#aeb4ce;line-height:1.75;white-space:pre-wrap}
    .aura-live-section .aura-live-cta{margin-top:14px;height:42px;font-size:12px}
    @media(max-width:700px){.aura-live-hero{padding:30px 18px 24px}.aura-live-hero h2{font-size:27px}.aura-live-form{flex-direction:column}.aura-live-sections{padding:4px 18px 22px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  window.renderAURALiveFunnelPreview=async function(data,businessId){
    const box=document.getElementById('funnelResult');if(!box)return;
    const {data:rows,error}=await supabaseClient.from('landing_pages')
      .select('page_type,page_name,headline,subheadline,body_content,call_to_action,status,public_slug,created_at')
      .eq('business_id',businessId).eq('page_type',data?.page_type||'landing_page')
      .order('created_at',{ascending:false}).limit(1);
    if(error)throw error;if(!rows?.length)return;
    const p=rows[0];
    const title=cleanText(p.headline||p.page_name||'Landing Page');
    const sub=cleanText(p.subheadline||'');
    const body=cleanText(p.body_content||'');
    const cta=cleanText(p.call_to_action||'Get Started');
    const publicLink=p.public_slug?new URL(window.location.href.split('?')[0]+'?lp='+encodeURIComponent(p.public_slug)).href:'';
    box.innerHTML='<div class="funnel-result-head"><div><div class="funnel-result-title">'+esc(title)+'</div><div class="funnel-result-meta">landing page · Latest generated preview</div></div><div style="display:flex;gap:8px;align-items:center"><span class="funnel-result-status">Preview</span>'+(publicLink?'<a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="funnel-copy-button" style="text-decoration:none">Open live page ↗</a>':'')+'</div></div>'+
      '<div class="aura-live-preview"><div class="aura-live-hero"><div class="aura-live-badge">AURA GENERATED</div><h2>'+esc(title)+'</h2>'+
      (sub?'<p>'+esc(sub)+'</p>':'')+'<div class="aura-live-form"><input type="email" placeholder="Enter your email address" disabled><button disabled>'+esc(cta)+'</button></div>'+
      '<div class="aura-live-note">'+(publicLink?'This landing page has a public link you can share.':'Public link is being prepared.')+'</div></div>'+
      '<div class="aura-live-sections"><section class="aura-live-section"><div class="aura-live-section-title">Page Content</div><div class="aura-live-section-body">'+esc(body)+'</div>'+
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">'+(publicLink?'<input value="'+esc(publicLink)+'" readonly style="flex:1;min-width:240px;height:42px;padding:0 12px;border:1px solid #292d51;border-radius:10px;background:#080b1b;color:#aeb4ce"><a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="aura-live-cta" style="text-decoration:none;display:inline-flex;align-items:center">Use this link ↗</a>':'')+'</div></section></div></div>';
  };
})();