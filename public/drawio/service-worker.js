if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return r[e]||(i=new Promise((async i=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=i}else importScripts(e),i()}))),i.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},i=(i,r)=>{Promise.all(i.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(i)};self.define=(i,a,c)=>{r[i]||(r[i]=Promise.resolve().then((()=>{let r={};const s={uri:location.origin+i.slice(1)};return Promise.all(a.map((i=>{switch(i){case"exports":return r;case"module":return s;default:return e(i)}}))).then((e=>{const i=c(...e);return r.default||(r.default=i),r}))})))}}define("./service-worker.js",["./workbox-99ba3a23"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"js/app.min.js",revision:"88284f107981766495eb32fc9df4518d"},{url:"js/extensions.min.js",revision:"c470725f929eefb4268d4c18866ebd09"},{url:"js/stencils.min.js",revision:"fca2dc9df4918381cea73ea1f0a79113"},{url:"js/shapes-14-6-5.min.js",revision:"a96cd0313eb634ec44f4fc94d8cc0785"},{url:"js/math-print.js",revision:"cf64f6a493a8cb5079f2b70813e478d7"},{url:"index.html",revision:"a3dcf8caa10e3ad0af9f1bac2830896b"},{url:"open.html",revision:"d71816b3b00e769fc6019fcdd6921662"},{url:"styles/fonts/ArchitectsDaughter-Regular.ttf",revision:"31c2153c0530e32553b31a49b3d70736"},{url:"styles/grapheditor.css",revision:"129b5fed4971e1728b24ec74a0b5cecb"},{url:"styles/atlas.css",revision:"d627cfef208f13a9cff1670f143c6348"},{url:"styles/dark.css",revision:"6ca28de9a0438d87fa84293e0b508db1"},{url:"js/dropbox/Dropbox-sdk.min.js",revision:"4b9842892aa37b156db0a8364b7a83b0"},{url:"js/onedrive/OneDrive.js",revision:"505e8280346666f7ee801bc59521fa67"},{url:"js/viewer-static.min.js",revision:"537e1ff53b609bdf200f49dab0dd24f8"},{url:"connect/jira/editor-1-3-3.html",revision:"a2b0e7267a08a838f3cc404eba831ec0"},{url:"connect/jira/viewerPanel-1-3-12.html",revision:"c96db1790184cb35781f791e8d1dafd9"},{url:"connect/jira/fullScreenViewer-1-3-3.html",revision:"ba7ece2dfb2833b72f97280d7092f25e"},{url:"connect/jira/viewerPanel.js",revision:"53e59b93d7e3dd107e2410aa1db57e5f"},{url:"connect/jira/spinner.gif",revision:"7d857ab9d86123e93d74d48e958fe743"},{url:"connect/jira/editor.js",revision:"f7a1bf925ded5b1713f3776a9bdc4569"},{url:"connect/jira/fullscreen-viewer-init.js",revision:"e00ad51fc16b87c362d6eaf930ab1fa5"},{url:"connect/jira/fullscreen-viewer.js",revision:"315dd64c85e841fd8c42b012edec43bb"},{url:"plugins/connectJira.js",revision:"4cefa13414e0d406550f3c073923080c"},{url:"plugins/cConf-comments.js",revision:"c787357209cff2986dcca567b599e2ef"},{url:"plugins/cConf-1-4-8.js",revision:"622d031e647f6a46e9b788fa340b31af"},{url:"connect/confluence/connectUtils-1-4-8.js",revision:"8acc41165f21ea499376b6311f88449e"},{url:"connect/new_common/cac.js",revision:"b1eb16ac1824f26824c748e8b8028e30"},{url:"connect/gdrive_common/gac.js",revision:"38f1df3ecc4d78290493f47e62202138"},{url:"connect/onedrive_common/ac.js",revision:"d089f12446d443ca01752a5115456fcc"},{url:"connect/confluence/viewer-init.js",revision:"8aa8d02147def4535563bc65632a3e6d"},{url:"connect/confluence/viewer.js",revision:"4bd2561a8679d1cc6049e271ce90b3fd"},{url:"connect/confluence/viewer-1-4-42.html",revision:"c14807286438f2236b44c9fb78eb4bb3"},{url:"connect/confluence/macroEditor-1-4-8.html",revision:"8cd74a2fb60bf2e3e86026d66107cf11"},{url:"connect/confluence/includeDiagram-1-4-8.js",revision:"4323d1a1afbd13163d5525e0b621b209"},{url:"connect/confluence/includeDiagram.html",revision:"1f2e4d088a8a1525ba047239643f3f4f"},{url:"connect/confluence/macro-editor.js",revision:"792d44b551d4a77a581388280dc3f1b1"},{url:"math/es5/startup.js",revision:"dc7130cdc866593293dbb5dde11ceb40"},{url:"math/es5/core.js",revision:"f71bc0bfb7d2ac8261747f97a5d47dd4"},{url:"math/es5/ui/safe.js",revision:"8c1fcfee7c879588ad409edcdd9cce53"},{url:"math/es5/output/svg.js",revision:"4f55967d16197ebb01b86356d8ab179a"},{url:"math/es5/input/tex.js",revision:"5c4f470da2ccb1acf85041fcecd6fff6"},{url:"math/es5/input/asciimath.js",revision:"c2d4076dd8e26d509bfe3a378e71cfa7"},{url:"math/es5/output/svg/fonts/tex.js",revision:"6eab785a3788ea805bd2b552d1f0aab8"},{url:"resources/dia.txt",revision:"b0153e68564c2b37707cca819ece0876"},{url:"resources/dia_am.txt",revision:"de09b795b3185a7e9572f4ed186f14ad"},{url:"resources/dia_ar.txt",revision:"45f17e304dc40201b3a52232e087d232"},{url:"resources/dia_bg.txt",revision:"4866ccf067a41f8e75b0c9d6e942b551"},{url:"resources/dia_bn.txt",revision:"0727c1a2097a86de30ff6a5cbcf0e101"},{url:"resources/dia_bs.txt",revision:"254f0f3f1b098b07993a523f411acac8"},{url:"resources/dia_ca.txt",revision:"8426bd8c570202732490cbf32a28cae1"},{url:"resources/dia_cs.txt",revision:"5ba6096e23be9ef45d31a0fbcd3022be"},{url:"resources/dia_da.txt",revision:"9e8a2b74dd7fb88e1a87177a018ac0b6"},{url:"resources/dia_de.txt",revision:"afca86ee56f27218ab388995e8bc92f4"},{url:"resources/dia_el.txt",revision:"7de07d0caff394bd264c92d590972a84"},{url:"resources/dia_eo.txt",revision:"8b188c04e4ba5c08cad6fc422a7538bd"},{url:"resources/dia_es.txt",revision:"3b8ba63219f6a6dcd300ee1ff7fdd0ed"},{url:"resources/dia_et.txt",revision:"e2ef1bb2238b6ffe5f9983944620e4fa"},{url:"resources/dia_eu.txt",revision:"6903078a81f87df1f99b159dc2a162ea"},{url:"resources/dia_fa.txt",revision:"8840c2e15e7bab872a66d0a25350f11d"},{url:"resources/dia_fi.txt",revision:"776d2cf869051f9c6a1833eb631a5f95"},{url:"resources/dia_fil.txt",revision:"fd635229d3892d52db6b927422a305d2"},{url:"resources/dia_fr.txt",revision:"8e550120cde9375d33837fe3389e949a"},{url:"resources/dia_gl.txt",revision:"96493b2a93b43139ecd684a5a65b409e"},{url:"resources/dia_gu.txt",revision:"3c55aefa6357ca5167a70d79f6464c96"},{url:"resources/dia_he.txt",revision:"a39eb6c1bc045c56ecc33ef16f2d6dd1"},{url:"resources/dia_hi.txt",revision:"ac781ff21dda42bc7c7b78ec707d6d65"},{url:"resources/dia_hr.txt",revision:"09af788b7c44b25ff1b947c4be74fbb8"},{url:"resources/dia_hu.txt",revision:"3ac71ce81b359da4643194920417a1be"},{url:"resources/dia_id.txt",revision:"6e466b69eef4c5c0607df7a11ba3af9e"},{url:"resources/dia_it.txt",revision:"36a7af7d74910b79786923824004b974"},{url:"resources/dia_ja.txt",revision:"8a50d2646606a1708518b0bd001167ec"},{url:"resources/dia_kn.txt",revision:"a0f958fb25bc2dea538d6822e30303aa"},{url:"resources/dia_ko.txt",revision:"2cf64a01a8e919f47f0286e28aa36968"},{url:"resources/dia_lt.txt",revision:"023f4261bb26eebd44b8b2c349bdc04c"},{url:"resources/dia_lv.txt",revision:"e7f0c61d9349437c64d69f77a7a8421b"},{url:"resources/dia_ml.txt",revision:"b5d315eaf59dbca1f6b6815506b26482"},{url:"resources/dia_mr.txt",revision:"2d241f50c68d9dbf21c07410d9124ce7"},{url:"resources/dia_ms.txt",revision:"317a226dfdd2127ac80fbb8968993157"},{url:"resources/dia_my.txt",revision:"b0153e68564c2b37707cca819ece0876"},{url:"resources/dia_nl.txt",revision:"f0ea57d88f0f617eabc04b9e5c3a28d8"},{url:"resources/dia_no.txt",revision:"0db821cf5b83cc8c2cd6a54aeaef5d12"},{url:"resources/dia_pl.txt",revision:"b118918567806d1c6486f742754625d6"},{url:"resources/dia_pt-br.txt",revision:"1bb0feead62fb33a3c576dabf69f8c08"},{url:"resources/dia_pt.txt",revision:"d760a2bde1f17402eaf7d8a32a2453a9"},{url:"resources/dia_ro.txt",revision:"934dbda89c21fe29656156bb11ad3a7c"},{url:"resources/dia_ru.txt",revision:"22d1d5e4a006c1208024ed297cc78daa"},{url:"resources/dia_si.txt",revision:"b0153e68564c2b37707cca819ece0876"},{url:"resources/dia_sk.txt",revision:"ee8bb9ccbe874e508977aab8175c5950"},{url:"resources/dia_sl.txt",revision:"21a2582eac4a9e810024cce93f38dcfb"},{url:"resources/dia_sr.txt",revision:"3ac7bc00d07e6f5e2edefb9d15aa1541"},{url:"resources/dia_sv.txt",revision:"f67336bc4232916ce748c7cc790ddfed"},{url:"resources/dia_sw.txt",revision:"34a061806b3caf166017fc3ab3675f87"},{url:"resources/dia_ta.txt",revision:"a0efa426085be9f2779328668a267ff5"},{url:"resources/dia_te.txt",revision:"beedcee4f88e01b2b3e44ec05d98b544"},{url:"resources/dia_th.txt",revision:"939ef55a4b385a783db49151e28b6905"},{url:"resources/dia_tr.txt",revision:"cf790505eace2b7efebf45acaada8323"},{url:"resources/dia_uk.txt",revision:"5ac2da36c65152e2cfbbe070a0b4b0c7"},{url:"resources/dia_vi.txt",revision:"57de6363de996ef44ab7afff35f4c81f"},{url:"resources/dia_zh-tw.txt",revision:"ea4cbcaab7f20bbc5c4a1d417ce58117"},{url:"resources/dia_zh.txt",revision:"bd4a8cd9c3a1c6ac66bac4780eab850b"},{url:"favicon.ico",revision:"fab2d88b37c72d83607527573de45281"},{url:"images/manifest.json",revision:"c6236bde53ed79aaaec60a1aca8ee2ef"},{url:"images/logo.png",revision:"89630b64b911ebe0daa3dfe442087cfa"},{url:"images/drawlogo.svg",revision:"4bf4d14ebcf072d8bd4c5a1c89e88fc6"},{url:"images/drawlogo48.png",revision:"8b13428373aca67b895364d025f42417"},{url:"images/drawlogo-gray.svg",revision:"0aabacbc0873816e1e09e4736ae44c7d"},{url:"images/drawlogo-text-bottom.svg",revision:"f6c438823ab31f290940bd4feb8dd9c2"},{url:"images/default-user.jpg",revision:"2c399696a87c8921f12d2f9e1990cc6e"},{url:"images/logo-flat-small.png",revision:"4b178e59ff499d6dd1894fc498b59877"},{url:"images/apple-touch-icon.png",revision:"73da7989a23ce9a4be565ec65658a239"},{url:"images/favicon-16x16.png",revision:"1a79d5461a5d2bf21f6652e0ac20d6e5"},{url:"images/favicon-32x32.png",revision:"e3b92da2febe70bad5372f6f3474b034"},{url:"images/android-chrome-196x196.png",revision:"f8c045b2d7b1c719fda64edab04c415c"},{url:"images/android-chrome-512x512.png",revision:"959b5fac2453963ff6d60fb85e4b73fd"},{url:"images/delete.png",revision:"5f2350f2fd20f1a229637aed32ed8f29"},{url:"images/droptarget.png",revision:"bbf7f563fb6784de1ce96f329519b043"},{url:"images/help.png",revision:"9266c6c3915bd33c243d80037d37bf61"},{url:"images/download.png",revision:"35418dd7bd48d87502c71b578cc6c37f"},{url:"images/logo-flat.png",revision:"038070ab43aee6e54a791211859fc67b"},{url:"images/google-drive-logo.svg",revision:"5d9f2f5bbc7dcc252730a0072bb23059"},{url:"images/onedrive-logo.svg",revision:"3645b344ec0634c1290dd58d7dc87b97"},{url:"images/dropbox-logo.svg",revision:"e6be408c77cf9c82d41ac64fa854280a"},{url:"images/github-logo.svg",revision:"a1a999b69a275eac0cb918360ac05ae1"},{url:"images/gitlab-logo.svg",revision:"0faea8c818899e58533e153c44b10517"},{url:"images/trello-logo.svg",revision:"006fd0d7d70d7e95dc691674cb12e044"},{url:"images/osa_drive-harddisk.png",revision:"b954e1ae772087c5b4c6ae797e1f9649"},{url:"images/osa_database.png",revision:"c350d9d9b95f37b6cfe798b40ede5fb0"},{url:"images/google-drive-logo-white.svg",revision:"f329d8b1be7778515a85b93fc35d9f26"},{url:"images/dropbox-logo-white.svg",revision:"4ea8299ac3bc31a16f199ee3aec223bf"},{url:"images/onedrive-logo-white.svg",revision:"b3602fa0fc947009cff3f33a581cff4d"},{url:"images/github-logo-white.svg",revision:"537b1127b3ca0f95b45782d1304fb77a"},{url:"images/gitlab-logo-white.svg",revision:"5fede9ac2f394c716b8c23e3fddc3910"},{url:"images/trello-logo-white-orange.svg",revision:"e2a0a52ba3766682f138138d10a75eb5"},{url:"images/logo-confluence.png",revision:"ed1e55d44ae5eba8f999aba2c93e8331"},{url:"images/logo-jira.png",revision:"f8d460555a0d1f87cfd901e940666629"},{url:"images/clear.gif",revision:"db13c778e4382e0b55258d0f811d5d70"},{url:"images/spin.gif",revision:"487cbb40b9ced439aa1ad914e816d773"},{url:"images/checkmark.gif",revision:"ba764ce62f2bf952df5bbc2bb4d381c5"},{url:"images/hs.png",revision:"fefa1a03d92ebad25c88dca94a0b63db"},{url:"images/aui-wait.gif",revision:"5a474bcbd8d2f2826f03d10ea44bf60e"},{url:"mxgraph/css/common.css",revision:"618b42f0bde0c7685e04811c25dc2b3e"},{url:"mxgraph/images/expanded.gif",revision:"2b67c2c035af1e9a5cc814f0d22074cf"},{url:"mxgraph/images/collapsed.gif",revision:"73cc826da002a3d740ca4ce6ec5c1f4a"},{url:"mxgraph/images/maximize.gif",revision:"5cd13d6925493ab51e876694cc1c2ec2"},{url:"mxgraph/images/minimize.gif",revision:"8957741b9b0f86af9438775f2aadbb54"},{url:"mxgraph/images/close.gif",revision:"8b84669812ac7382984fca35de8da48b"},{url:"mxgraph/images/resize.gif",revision:"a6477612b3567a34033f9cac6184eed3"},{url:"mxgraph/images/separator.gif",revision:"7819742ff106c97da7a801c2372bbbe5"},{url:"mxgraph/images/window.gif",revision:"fd9a21dd4181f98052a202a0a01f18ab"},{url:"mxgraph/images/window-title.gif",revision:"3fb1d6c43246cdf991a11dfe826dfe99"},{url:"mxgraph/images/button.gif",revision:"00759bdc3ad218fa739f584369541809"},{url:"mxgraph/images/point.gif",revision:"83a43717b284902442620f61bc4e9fa6"}],{ignoreURLParametersMatching:[/.*/]})}));
//# sourceMappingURL=service-worker.js.map