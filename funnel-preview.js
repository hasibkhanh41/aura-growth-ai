(function(){
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const cleanText=v=>String(v??'').replace(/<\/?(h1|h2|h3|h4|p|strong|em|br|ul|ol|li)[^>]*>/gi,' ').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  const css=`
    .aura-live-preview{margin-top:18px;border:1px solid #292d51;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#0d1023,#080a18);box-shadow:0 20px 60px rgba(0,0,0,.28)}
    .aura-variant-bar{padding:16px;border-bottom:1px solid #292d51;background:rgba(8,10,24,.9)}
    .aura-variant-title{font-size:12px;font-weight:900;color:#fff;margin-bottom:5px}
    .aura-variant-help{font-size:10px;color:#7f86a3;margin-bottom:12px}
    .aura-variant-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
    .aura-variant-card{display:flex;flex-direction:column;gap:5px;padding:11px 9px;border:1px solid #292d51;border-radius:12px;background:#0b0e1d;color:#aeb4ce;cursor:pointer;text-align:left}
    .aura-variant-card:hover{border-color:#6f43ff;transform:translateY(-1px)}
    .aura-variant-card strong{font-size:11px;color:#fff}
    .aura-variant-card span{font-size:9px;color:#777e9b;line-height:1.4}
    .aura-variant-card.active{border-color:#a900ff;background:linear-gradient(145deg,rgba(169,0,255,.13),rgba(37,99,235,.05))}
    .aura-variant-card a{margin-top:4px;color:#c8a7ff;font-size:9px;text-decoration:none}
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
    @media(max-width:900px){.aura-variant-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:700px){.aura-variant-grid{grid-template-columns:1fr 1fr}.aura-live-hero{padding:30px 18px 24px}.aura-live-hero h2{font-size:27px}.aura-live-form{flex-direction:column}.aura-live-sections{padding:4px 18px 22px}}`;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  window.renderAURALiveFunnelPreview=async function(data,businessId){
    const box=document.getElementById('funnelResult');if(!box)return;
    const {data:rows,error}=await supabaseClient.from('landing_pages')
      .select('page_type,page_name,headline,subheadline,body_content,call_to_action,status,public_slug,created_at')
      .eq('business_id',businessId).eq('page_type',data?.page_type||'landing_page')
      .order('created_at',{ascending:false}).limit(1);
    if(error)throw error;if(!rows?.length)return;
    const p=rows[0];

    const base=window.location.href.split('?')[0];
    const variants=[
      {name:'Focused Guide',desc:'Hero + focused content',icon:'✦'},
      {name:'Action Plan',desc:'Step-by-step structure',icon:'→'},
      {name:'Resource Cards',desc:'Card-based offer layout',icon:'▦'},
      {name:'Simple Offer',desc:'Clean minimal layout',icon:'◌'},
      {name:'Campaign Spotlight',desc:'High-impact campaign layout',icon:'◆'}
    ];

    const title=cleanText(p.headline||p.page_name||'Landing Page');
    const sub=cleanText(p.subheadline||'');
    const body=cleanText(p.body_content||'');
    const cta=cleanText(p.call_to_action||'Get Started');
    const currentParam=Number(new URLSearchParams(window.location.search).get('variant'));
    const active=Number.isFinite(currentParam)&&currentParam>=1&&currentParam<=5?currentParam:1;

    const linkFor=i=>p.public_slug?base+'?lp='+encodeURIComponent(p.public_slug)+'&variant='+i:'';
    const variantCards=variants.map((v,i)=>{
      const n=i+1;
      const link=linkFor(n);
      return '<div class="aura-variant-card '+(n===active?'active':'')+'"><strong>'+esc(v.icon)+' Concept '+n+'</strong><span>'+esc(v.name)+'</span><span>'+esc(v.desc)+'</span>'+(link?'<a href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Open concept ↗</a>':'')+'</div>';
    }).join('');

    const publicLink=linkFor(active);

    box.innerHTML='<div class="funnel-result-head"><div><div class="funnel-result-title">'+esc(title)+'</div><div class="funnel-result-meta">5 dynamic landing-page concepts generated · choose the one you want to use</div></div><div style="display:flex;gap:8px;align-items:center"><span class="funnel-result-status">5 Concepts</span>'+(publicLink?'<a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="funnel-copy-button" style="text-decoration:none">Open selected ↗</a>':'')+'</div></div>'+
      '<div class="aura-live-preview">'+
      '<div class="aura-variant-bar"><div class="aura-variant-title">Choose your landing-page design</div><div class="aura-variant-help">AURA keeps the same campaign goal and content, but gives you 5 different presentation styles.</div><div class="aura-variant-grid">'+variantCards+'</div></div>'+
      '<div class="aura-live-hero"><div class="aura-live-badge">AURA CONCEPT '+active+'</div><h2>'+esc(title)+'</h2>'+
      (sub?'<p>'+esc(sub)+'</p>':'')+'<div class="aura-live-form"><input type="email" placeholder="Email address" disabled><button disabled>'+esc(cta)+'</button></div>'+
      '<div class="aura-live-note">Concept '+active+' selected · open it to view the full live page.</div></div>'+
      '<div class="aura-live-sections"><section class="aura-live-section"><div class="aura-live-section-title">Campaign content</div><div class="aura-live-section-body">'+esc(body)+'</div>'+
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">'+(publicLink?'<input value="'+esc(publicLink)+'" readonly style="flex:1;min-width:240px;height:42px;padding:0 12px;border:1px solid #292d51;border-radius:10px;background:#080b1b;color:#aeb4ce"><a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="aura-live-cta" style="text-decoration:none;display:inline-flex;align-items:center">Use concept '+active+' ↗</a>':'')+'</div></section></div></div>';
  };
})();