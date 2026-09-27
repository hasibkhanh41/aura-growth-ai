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
      {name:'CPA Pre-sell Guide',desc:'Advertorial-style pre-sell with benefits + offer context',icon:'✦'},
      {name:'CPA Qualifier Flow',desc:'Step-by-step qualification journey before the CTA',icon:'→'},
      {name:'CPA Resource Lead',desc:'Resource cards + FAQ + voluntary lead capture',icon:'▦'},
      {name:'CPA Direct Offer',desc:'Minimal offer-first page with one clear action',icon:'◌'},
      {name:'CPA Advertorial',desc:'Editorial article layout with story + decision points',icon:'◆'}
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

    const previewVariants=[
      '<div style="background:#070816;color:#fff;padding:38px;text-align:left"><div style="font-size:9px;letter-spacing:2px;color:#a900ff;font-weight:900">CPA PRE-SELL GUIDE</div><h2 style="font-size:34px;max-width:650px;margin:14px 0">'+esc(title)+'</h2><p style="color:#aeb4ce;max-width:620px;line-height:1.7">'+esc(sub||body.slice(0,180))+'</p><div style="display:grid;grid-template-columns:1.4fr .6fr;gap:12px;margin-top:24px"><div style="padding:22px;border:1px solid #292d51;border-radius:16px"><strong>Why this offer may fit</strong><p style="color:#8f96b0;font-size:11px">Pre-sell information and factual benefits.</p></div><div style="padding:22px;border-radius:16px;background:#a900ff;color:#fff"><strong>Next step</strong><p style="font-size:11px">One clear CPA action.</p></div></div></div>',
      '<div style="background:#f5f1e8;color:#171717;padding:34px;text-align:left;font-family:Georgia,serif"><div style="font:900 9px Inter,sans-serif;letter-spacing:2px;color:#8a6b35">CPA QUALIFIER FLOW</div><h2 style="font-size:32px;max-width:650px;margin:14px 0">'+esc(title)+'</h2><p style="color:#675f54;line-height:1.7">'+esc(sub||body.slice(0,150))+'</p><div style="margin-top:22px;border-left:2px solid #c5a76b">'+[1,2,3,4].map(n=>'<div style="padding:12px 18px;border-bottom:1px solid #ddd2c0"><strong>0'+n+' · Qualification step</strong><div style="font:12px Inter,sans-serif;color:#756b5d;margin-top:5px">Review the next requirement before continuing.</div></div>').join('')+'</div></div>',
      '<div style="background:#eef3f1;color:#10201c;padding:30px;text-align:left"><div style="font:900 9px Inter,sans-serif;letter-spacing:2px;color:#087f68">CPA RESOURCE LEAD</div><h2 style="font-size:30px;margin:14px 0">'+esc(title)+'</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px">'+[1,2,3].map(n=>'<div style="padding:20px;background:#fff;border:1px solid #cbdcd7;border-radius:16px"><strong>Resource '+n+'</strong><p style="color:#5e746e;font-size:11px">Useful campaign information.</p></div>').join('')+'</div><div style="margin-top:18px;padding:18px;background:#12352e;color:#fff;border-radius:14px">Voluntary email capture + FAQ</div></div>',
      '<div style="background:#fff;color:#111;padding:52px 30px;text-align:center"><div style="font:900 9px Inter,sans-serif;letter-spacing:2px;color:#555">CPA DIRECT OFFER</div><h2 style="font-size:44px;letter-spacing:-2px;margin:16px auto;max-width:700px">'+esc(title)+'</h2><p style="color:#666;max-width:560px;margin:auto;line-height:1.8">'+esc(sub||body.slice(0,150))+'</p><button style="margin-top:24px;background:#111;color:#fff;border:0;border-radius:6px;padding:15px 28px;font-weight:800">'+esc(cta)+'</button><div style="margin-top:18px;color:#888;font-size:10px">Offer facts · eligibility · one clear action</div></div>',
      '<div style="background:#f4efe5;color:#201c17;padding:30px;text-align:left;font-family:Georgia,serif"><div style="font:900 9px Inter,sans-serif;letter-spacing:2px;color:#8b2c2c">CPA ADVERTORIAL</div><div style="display:grid;grid-template-columns:145px 1fr;gap:22px;margin-top:18px"><aside style="border-right:1px solid #d8cbb9;padding-right:16px;font:11px Inter,sans-serif;color:#756b5d;line-height:2">OVERVIEW<br>OFFER FIT<br>FAQ<br>NEXT STEP</aside><article><h2 style="font-size:32px;margin:0 0 12px">'+esc(title)+'</h2><p style="color:#655d52;line-height:1.85">'+esc(body.slice(0,430)||sub)+'</p><div style="margin-top:18px;padding-top:18px;border-top:1px solid #ded2c1;font:12px Inter,sans-serif;color:#6d6255">Editorial story + factual offer context</div></article></div></div>'
    ];
    const previewMarkup=previewVariants[active-1];
    const publicLink=linkFor(active);

    box.innerHTML='<div class="funnel-result-head"><div><div class="funnel-result-title">'+esc(title)+'</div><div class="funnel-result-meta">5 dynamic landing-page concepts generated · choose the one you want to use</div></div><div style="display:flex;gap:8px;align-items:center"><span class="funnel-result-status">5 Concepts</span>'+(publicLink?'<a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="funnel-copy-button" style="text-decoration:none">Open selected ↗</a>':'')+'</div></div>'+
      '<div class="aura-live-preview">'+
      '<div class="aura-variant-bar"><div class="aura-variant-title">Choose your landing-page design</div><div class="aura-variant-help">AURA turns the same campaign brief into 5 different page structures — not just different colors.</div><div class="aura-variant-grid">'+variantCards+'</div></div>'+
      previewMarkup+
      '<div class="aura-live-note" style="padding:16px 28px">Concept '+active+' selected · this preview mirrors the public page structure.</div>'+
      '<div class="aura-live-sections"><section class="aura-live-section"><div class="aura-live-section-title">Public page</div>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap">'+(publicLink?'<input value="'+esc(publicLink)+'" readonly style="flex:1;min-width:240px;height:42px;padding:0 12px;border:1px solid #292d51;border-radius:10px;background:#080b1b;color:#aeb4ce"><a href="'+esc(publicLink)+'" target="_blank" rel="noopener noreferrer" class="aura-live-cta" style="text-decoration:none;display:inline-flex;align-items:center">Open concept '+active+' ↗</a>':'')+'</div></section></div></div>';
  };
})();