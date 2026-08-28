'use client';
import { useEffect, useId, useState, type ReactNode } from 'react';

type View='home'|'about'|'pass'|'passcheckout'|'passdone'|'eventlist'|'walk'|'culture'|'experience'|'shop'|'shoplist'|'maker'|'spot'|'map'|'search';
type AppState={saved:boolean;booked:boolean;passOwned:boolean;passPlan:string;makerId:string};

const gmap=(q:string)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const officialLinks={
 tourism:'https://www.kankou-gifu.jp/',
 craft:'https://www.kankou-gifu.jp/article/detail_72.html',
 wagasa:'https://wagasa.shop/collections/products',
 wagasaStory:'https://www.kankou-gifu.jp/article/detail_126.html',
 casaSpot:'https://www.kankou-gifu.jp/spot/detail_5995.html',
 ozeki:'https://www.ozeki-lantern.co.jp/index.html',
 ozekiProducts:'https://www.ozeki-lantern.co.jp/product-aerofoil.html',
 gifts:'https://giftsshop.jp/',
 giftsInfo:'https://www.pref.gifu.lg.jp/page/11931.html',
 kawaramachi:'https://www.kankou-gifu.jp/blog/detail_29.html',
 mediacosmos:'https://g-mediacosmos.jp/',
 rekihaku:'https://www.rekihaku.gifu.gifu.jp/',
 kenbi:'https://kenbi.pref.gifu.lg.jp/',
 ncc:'https://www.g-ncc.jp/',
 nawakon:'http://www.nawakon.jp/',
 sanko:'https://www.sanko-museum.or.jp/',
 starPlace:'https://star-gifu.jp/',
 soukoMap:gmap('やながせ倉庫 岐阜市'),
 tonyamachiMap:gmap('岐阜市 問屋町'),
 yanagaseGaroMap:gmap('柳ヶ瀬画廊 岐阜市')
};
function OfficialLink({href,children,className='official-link'}:{href:string;children:ReactNode;className?:string}){return <a className={className} href={href} target="_blank" rel="noreferrer">{children} ↗</a>}
const shopOfficialResources=[
 ['岐阜県観光公式','岐阜のすぐれもの・伝統工芸',officialLinks.craft],
 ['店舗公式','和傘CASA 公式オンラインショップ',officialLinks.wagasa],
 ['岐阜県観光公式','岐阜和傘の文化と作り手',officialLinks.wagasaStory],
 ['企業公式','株式会社オゼキ(岐阜提灯)',officialLinks.ozeki],
 ['店舗公式','THE GIFTS SHOP',officialLinks.gifts],
 ['岐阜県公式','県産品拠点の施設情報',officialLinks.giftsInfo]
];
function OfficialDirectory({compact=false}:{compact?:boolean}){return <section className={`official-directory ${compact?'compact':''}`}><header><div><small>OFFICIAL INFORMATION</small><h2>公式情報から、もっと深く知る</h2></div><p>営業時間・在庫・予約条件はリンク先の最新情報をご確認ください。</p></header><div>{shopOfficialResources.map(x=><a key={x[1]} href={x[2]} target="_blank" rel="noreferrer"><small>{x[0]}</small><b>{x[1]}</b><span>公式ページへ　↗</span></a>)}</div></section>}
function PageOfficialLinks({title='関連する公式ページ',items}:{title?:string;items:[string,string][]}){return <section className="page-official-links"><h3>{title}</h3><div>{items.map(x=><OfficialLink key={x[0]} href={x[1]}>{x[0]}</OfficialLink>)}</div></section>}

const homeImages={
 souko:'/spots/souko-1.jpg',
 souko2:'/spots/souko-2.jpg',
 souko3:'/spots/souko-3.jpg',
 soukoBoard:'/spots/yanagase-souko.jpg',
 park:'/spots/gifu-park.jpg',
 mediacosmos:'/spots/media-cosmos.jpg',
 wagasa:'/spots/wagasa.jpg',
 wallart:'/spots/wall-art.jpg',
 machiya:'/spots/kawaramachi.jpg',
 starSax:'/spots/star-sax.jpg',
 street:'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=82',
 craft:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=82',
 paper:'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=900&q=82',
 architecture:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=82',
 stockMachiya:'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=900&q=82'
};

/* ---------- GIFU ART PASS (販売導線モック・決済なし) ---------- */
const passPlans=[
 {id:'1day',name:'ART PASS 1DAY',price:'¥600',period:'最初の入館から24時間有効',copy:'岐阜公園の2館(計620円)を巡るだけで元が取れる。'},
 {id:'2day',name:'ART PASS 2DAY',price:'¥900',period:'最初の入館から48時間有効',copy:'一泊して県美術館まで。公立3館(計960円)で元が取れる。'},
 {id:'2dayplus',name:'ART PASS 2DAY+',price:'¥1,500',period:'最初の入館から48時間有効',copy:'三甲美術館込み。三甲+どれか1館(計1,510円)で元が取れる。'}
];
const passTargets:[string,string,string][]=[
 ['岐阜市歴史博物館','岐阜公園内・通常 大人310円',officialLinks.rekihaku],
 ['加藤栄三・東一記念美術館','岐阜公園内(歴史博物館 分館)・通常 大人310円',officialLinks.rekihaku],
 ['岐阜県美術館','宇佐・JR西岐阜駅側・通常 大人340円',officialLinks.kenbi],
 ['三甲美術館(沙羅双樹の館)','長良・通常 大人1,200円 ※2DAY+のみ対象',officialLinks.sanko]
];
const passPerkSpots:[string,string,string][]=[
 ['ぎふメディアコスモス','司町・入館無料。市民の展示スペースをスタンプポイントに',officialLinks.mediacosmos],
 ['やながせ倉庫','柳ヶ瀬・パス提示で作家スペースの特典(構想)',officialLinks.soukoMap],
 ['和傘CASA / CASA stella','川原町・パス提示で工芸店の特典(構想)',officialLinks.casaSpot]
];

/* ---------- 岐阜市の徒歩動線圏の施設(実在) ---------- */
const citySpots=[
 {name:'岐阜市歴史博物館',area:'岐阜公園',cat:'美術館・博物館',url:officialLinks.rekihaku},
 {name:'加藤栄三・東一記念美術館',area:'岐阜公園',cat:'美術館・博物館',url:officialLinks.rekihaku},
 {name:'名和昆虫博物館(1919年開館)',area:'岐阜公園',cat:'建築',url:officialLinks.nawakon},
 {name:'ぎふメディアコスモス(設計:伊東豊雄)',area:'司町',cat:'建築',url:officialLinks.mediacosmos},
 {name:'長良川国際会議場(設計:安藤忠雄)',area:'長良川北岸',cat:'建築',url:officialLinks.ncc},
 {name:'岐阜県美術館',area:'宇佐(JR西岐阜駅側)',cat:'美術館・博物館',url:officialLinks.kenbi},
 {name:'三甲美術館(沙羅双樹の館)',area:'長良',cat:'美術館・博物館',url:officialLinks.sanko},
 {name:'スタープレイス柳ヶ瀬商店街',area:'西柳ヶ瀬・柳ヶ瀬本通り',cat:'市民アート',url:officialLinks.starPlace},
 {name:'やながせ倉庫',area:'柳ヶ瀬',cat:'市民アート',url:officialLinks.soukoMap},
 {name:'柳ヶ瀬画廊(大正8年創業)',area:'柳ヶ瀬',cat:'市民アート',url:officialLinks.yanagaseGaroMap},
 {name:'和傘CASA / CASA stella',area:'川原町',cat:'工芸',url:officialLinks.casaSpot},
 {name:'THE GIFTS SHOP',area:'岐阜駅・アクティブG',cat:'工芸',url:officialLinks.gifts},
 {name:'問屋町のウォールアート',area:'問屋町',cat:'市民アート',url:officialLinks.tonyamachiMap},
 {name:'川原町の町家エリア',area:'川原町',cat:'まち歩き',url:officialLinks.kawaramachi}
];

/* ---------- 作り手(差別化の主砲:購入・応援が作り手に届く) ---------- */
type MakerInfo={id:string;name:string;area:string;craft:string;title:string;body:string;back:string;image:string;links:[string,string][]};
const makers:MakerInfo[]=[
 {id:'casa',name:'和傘CASA / CASA stella',area:'川原町(湊町)',craft:'岐阜和傘(2022年 国の伝統的工芸品指定)',title:'全国唯一の岐阜和傘専門店',
  body:'NPO法人ORGANが運営する岐阜和傘の専門店(2018年開店)と、和傘・提灯の文化観光施設(2025年開設)。職人の後継者育成にも取り組んでいます。',
  back:'公式ショップでの購入は、作り手と後継者育成の活動に直接つながります。',image:homeImages.wagasa,
  links:[['公式オンラインショップ',officialLinks.wagasa],['岐阜和傘の文化と作り手(県観光公式)',officialLinks.wagasaStory],['店舗情報(県観光公式)',officialLinks.casaSpot]]},
 {id:'ozeki',name:'株式会社オゼキ',area:'岐阜市',craft:'岐阜提灯(1995年 国の伝統的工芸品指定)',title:'岐阜提灯の老舗メーカー',
  body:'美濃和紙と竹ひごから生まれる、やわらかなあかりの道具。伝統的な盆提灯から現代のインテリア照明まで手がけています。',
  back:'公式サイトからの購入が、岐阜提灯の作り手を支えます。',image:homeImages.paper,
  links:[['公式サイト',officialLinks.ozeki],['製品紹介',officialLinks.ozekiProducts]]},
 {id:'souko',name:'やながせ倉庫',area:'柳ヶ瀬アーケード',craft:'雑貨・イラスト・ハンドメイド等',title:'作家が集まる、自治的な「団地」',
  body:'築60年級のビルを2004年頃から改装し、アーティスト・クリエイターが小さな部屋を間借りしてアトリエ兼ショップとして使う空間。入口の掲示板には入居作家の名刺やフライヤーがびっしり並びます(2026年8月 実地確認)。',
  back:'ここでの購入は、その場で作家本人に届きます。',image:homeImages.souko,
  links:[['場所を地図で見る',officialLinks.soukoMap]]}
];

/* ---------- 体験(岐阜市内のみ・実在情報ベース) ---------- */
const experienceCategories=[
 {icon:'✦',label:'すべて'},{icon:'▥',label:'美術館・博物館'},{icon:'❖',label:'建築'},{icon:'⚒',label:'工芸'},{icon:'♧',label:'市民アート'},{icon:'⌂',label:'まち歩き'}
];
const experienceItems=[
 {category:'工芸',title:'岐阜和傘の店を訪ねる',copy:'全国唯一の岐阜和傘専門店で、竹の骨と和紙の手仕事に出会う。',place:'川原町・和傘CASA',info:'2022年 国の伝統的工芸品',image:homeImages.wagasa,url:officialLinks.casaSpot,makerId:'casa'},
 {category:'美術館・博物館',title:'歴史博物館で楽市楽座を歩く',copy:'信長の城下町を再現した体験型展示。岐阜城観光の足元にある。',place:'岐阜公園',info:'大人310円',image:homeImages.park,url:officialLinks.rekihaku},
 {category:'美術館・博物館',title:'加藤栄三・東一記念美術館',copy:'長良川や鵜飼を描いた岐阜市出身の日本画家兄弟の作品を収蔵。',place:'岐阜公園',info:'大人310円',image:homeImages.park,url:officialLinks.rekihaku},
 {category:'美術館・博物館',title:'三甲美術館(沙羅双樹の館)',copy:'ルノワールやシャガールなどの絵画と、趣ある日本庭園を楽しむ。',place:'長良',info:'大人1,200円',image:homeImages.stockMachiya,url:officialLinks.sanko},
 {category:'建築',title:'ぎふメディアコスモスを歩く',copy:'伊東豊雄設計の木格子の大屋根の下で、市民の展示に出会う。',place:'司町',info:'入館無料',image:homeImages.mediacosmos,url:officialLinks.mediacosmos},
 {category:'建築',title:'長良川国際会議場を見る',copy:'安藤忠雄設計。コンクリートと大屋根の建築を川辺に訪ねる。',place:'長良川北岸',info:'外観・催事は公式で',image:homeImages.architecture,url:officialLinks.ncc},
 {category:'市民アート',title:'やながせ倉庫を歩く',copy:'作家のアトリエ兼ショップが集まるビルで、作り手と直接話す。',place:'柳ヶ瀬',info:'営業は店舗ごとに異なる',image:homeImages.souko,url:officialLinks.soukoMap,spot:true,makerId:'souko'},
 {category:'まち歩き',title:'川原町の町家をめぐる',copy:'格子戸の旧川湊の街並み。工芸店・ギャラリー・和菓子店が点在。',place:'川原町',info:'散策自由',image:homeImages.machiya,url:officialLinks.kawaramachi},
 {category:'市民アート',title:'問屋町のウォールアート',copy:'建物の外壁に描かれた空が、晴れた日には現実の空とつながる。',place:'問屋町',info:'屋外・見学自由',image:homeImages.wallart,url:officialLinks.tonyamachiMap}
];

/* ---------- ショップ(作り手に紐づく) ---------- */
const shopItems=[
 {tag:'岐阜和傘',title:'岐阜和傘(日傘・蛇の目ほか)',maker:'和傘CASA',makerId:'casa',price:'価格は公式ショップで',image:homeImages.wagasa,url:officialLinks.wagasa},
 {tag:'岐阜提灯',title:'岐阜提灯・あかりの道具',maker:'株式会社オゼキ',makerId:'ozeki',price:'価格は公式サイトで',image:homeImages.paper,url:officialLinks.ozekiProducts},
 {tag:'クラフト',title:'やながせ倉庫の作家作品',maker:'入居作家',makerId:'souko',price:'現地で作家から直接',image:homeImages.souko,url:officialLinks.soukoMap},
 {tag:'県産品',title:'THE GIFTS SHOP',maker:'岐阜県産品拠点(岐阜駅・アクティブG)',makerId:'',price:'店舗・公式サイトで',image:homeImages.craft,url:officialLinks.gifts}
];

/* ---------- イベント(実在・日付は公式優先) ---------- */
type EventItem={title:string;date:string;place:string;image:string;url:string;toAbout?:boolean;kind:'regular'|'check'|'past'};
const eventItems:EventItem[]=[
 {title:'サンデービルヂングマーケット',date:'月2回・開催日は公式情報を確認',place:'柳ヶ瀬アーケード',image:homeImages.souko,url:gmap('サンデービルヂングマーケット 柳ヶ瀬'),kind:'regular'},
 {title:'スタープレイス柳ヶ瀬 ネオン点灯',date:'毎週土曜の夜',place:'西柳ヶ瀬・柳ヶ瀬本通り',image:homeImages.starSax,url:officialLinks.starPlace,kind:'regular'},
 {title:'柳ケ瀬日常ニナーレ',date:'通年・まちの体験プログラム',place:'柳ヶ瀬',image:homeImages.souko2,url:gmap('柳ヶ瀬商店街'),kind:'regular'},
 {title:'岐阜市美術展覧会(市展)',date:'市民公募展・開催時期は市公式で',place:'岐阜市',image:homeImages.craft,url:officialLinks.tourism,kind:'check'},
 {title:'岐阜フラッグアート展',date:'1997年〜・現在は休止',place:'岐阜駅〜柳ヶ瀬のアーケード',image:homeImages.souko3,url:officialLinks.tourism,toAbout:true,kind:'past'}
];
const eventGroups=()=>({
 now:eventItems.filter(x=>x.kind==='regular'),
 later:eventItems.filter(x=>x.kind==='check'),
 past:eventItems.filter(x=>x.kind==='past')
});

const walkStops=[
 {name:'岐阜公園',sub:'歴史博物館・加藤栄三・東一記念美術館・名和昆虫博物館'},
 {name:'川原町',sub:'町家の街並み・和傘CASA・工芸店(徒歩約10分)'},
 {name:'ぎふメディアコスモス',sub:'司町・伊東豊雄設計の図書館+ギャラリー'},
 {name:'柳ヶ瀬',sub:'やながせ倉庫・柳ヶ瀬画廊・アーケード'},
 {name:'JR岐阜駅',sub:'THE GIFTS SHOP・徒歩動線のゴール'}
];
const walkDirectionsUrl='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent('岐阜公園')+'&destination='+encodeURIComponent('JR岐阜駅')+'&waypoints='+encodeURIComponent('川原町通り 岐阜市|ぎふメディアコスモス|柳ヶ瀬商店街');
function LiveWalkMap({compact=false}:{compact?:boolean}){return <section className={`live-walk-map ${compact?'compact':''}`}><iframe title="岐阜市の実地図" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=136.735%2C35.400%2C136.795%2C35.450&layer=mapnik"/><div><span>岐阜市中心部</span><a href={gmap('岐阜市 川原町 柳ヶ瀬 アート ギャラリー')} target="_blank" rel="noreferrer">Google Mapsで周辺を探す ↗</a><a href={walkDirectionsUrl} target="_blank" rel="noreferrer">Google Mapsでルートを開く ↗</a></div></section>}
const routePoints=[
 {x:564,y:186,name:'岐阜公園'},
 {x:413,y:96,name:'川原町'},
 {x:196,y:300,name:'メディアコスモス'},
 {x:152,y:368,name:'柳ヶ瀬'},
 {x:120,y:474,name:'JR岐阜駅'}
];
function RouteMap(){return <figure className="walk-route-fig"><svg viewBox="0 0 700 520" role="img" aria-label="岐阜公園から岐阜駅までの徒歩動線の模式図">
 <rect width="700" height="520" fill="#f1ead9"/>
 <path d="M0,118 C160,66 340,128 520,76 C600,52 660,58 700,48 L700,0 L0,0 Z" fill="#c9d8e2"/>
 <text x="620" y="32" fontSize="14" fill="#5b7286">長良川</text>
 <circle cx="646" cy="150" r="42" fill="#dce3cf"/>
 <text x="620" y="155" fontSize="12" fill="#6b7a55">金華山</text>
 <polyline points={routePoints.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#c59a4f" strokeWidth="5" strokeDasharray="10 7" strokeLinecap="round" strokeLinejoin="round"/>
 {routePoints.map((p,i)=><g key={p.name}><circle cx={p.x} cy={p.y} r="15" fill="#071b40"/><text x={p.x} y={p.y+5} textAnchor="middle" fontSize="14" fill="#e3c78f">{i+1}</text><text x={i===0?p.x-24:p.x+24} y={p.y+5} textAnchor={i===0?'end':'start'} fontSize="16" fontWeight="bold" fill="#15233a">{p.name}</text></g>)}
 <text x="18" y="504" fontSize="11" fill="#8a7f6a">徒歩約3km(模式図・縮尺と位置は概略)</text>
</svg><figcaption>模式図です。実際のルートは「Google Mapsでこのルートを歩く」から確認できます。</figcaption></figure>}

/* ---------- 共通UI ---------- */
function Top({title,back,go}:{title:string;back?:boolean;go:(v:View)=>void}){return <header className="topbar"><button className="icon" onClick={()=>go('home')} aria-label="戻る">{back?'‹':'⌁'}</button><strong>{title}</strong><button className="icon" onClick={()=>go('pass')} aria-label="アートパス">▣</button></header>}
function Nav({view,go}:{view:View;go:(v:View)=>void}){const n:[View,string,string][]=[['home','⌂','ホーム'],['search','⌕','探す'],['pass','▣','パス'],['map','◫','マップ'],['shop','♡','ショップ']];return <nav className="bottomnav">{n.map(([v,i,l])=><button key={v} className={view===v?'active':''} onClick={()=>go(v)}><span>{i}</span>{l}</button>)}</nav>}
function DemoNote({children}:{children:ReactNode}){return <p className="demo-note">{children}</p>}

/* ---------- FEATURED STORIES(第1弾:やながせ倉庫・和傘CASA・川原町) ---------- */
function HomeSlideshow({go}:{go:(v:View)=>void}){const slides=[
 {tag:'STORY 01',title:'ビルまるごと、作家の団地。',copy:'柳ヶ瀬・やながせ倉庫を歩く。',image:homeImages.souko,to:'spot' as View},
 {tag:'STORY 02',title:'傘をひらくと、岐阜がある。',copy:'川原町・和傘CASAと岐阜和傘の作り手。',image:homeImages.wagasa,to:'maker' as View},
 {tag:'STORY 03',title:'格子戸の向こうの、手仕事。',copy:'川原町の町家と工芸の店をめぐる。',image:homeImages.machiya,to:'walk' as View}
];const [active,setActive]=useState(0);useEffect(()=>{const timer=setInterval(()=>setActive(v=>(v+1)%slides.length),4800);return()=>clearInterval(timer)},[]);const move=(d:number)=>setActive(v=>(v+d+slides.length)%slides.length);return <section className="gl-slideshow" aria-label="特集ストーリー"><div className="gl-slide-viewport"><div className="gl-slide-track" style={{transform:`translateX(-${active*100}%)`}}>{slides.map(slide=><button key={slide.title} className="gl-slide-panel" style={{backgroundImage:`linear-gradient(90deg,#071827de,#07182738),url('${slide.image}')`}} onClick={()=>go(slide.to)}><span>{slide.tag} / FEATURE</span><h2>{slide.title}</h2><p>{slide.copy}</p><em>物語を読む　›</em></button>)}</div><button className="gl-slide-arrow prev" onClick={()=>move(-1)} aria-label="前のスライド">‹</button><button className="gl-slide-arrow next" onClick={()=>move(1)} aria-label="次のスライド">›</button><div className="gl-slide-progress"><i style={{width:`${((active+1)/slides.length)*100}%`}}/></div></div><div className="gl-slide-controls"><b>FEATURED STORIES</b>{slides.map((x,i)=><button key={x.title} className={i===active?'active':''} onClick={()=>setActive(i)} aria-label={`${i+1}枚目を表示`}><span>0{i+1}</span><small>{x.tag}</small></button>)}</div></section>}

/* ---------- ABOUT(岐阜市に根付いた芸術活動) ---------- */
const aboutTimeline:[string,string,string][]=[
 ['1919','柳ヶ瀬画廊 創業','大正8年から続く老舗画廊。岐阜ゆかりの画家・熊谷守一を扱ってきた、柳ヶ瀬の画廊文化の証人。'],
 ['1997','岐阜フラッグアート展 はじまる','岐阜駅〜柳ヶ瀬のアーケードに布作品を吊るす全国公募展。審査委員長は岐阜市出身の日比野克彦氏(現・岐阜県美術館長)。2006年「ふるさとイベント大賞」大賞を受賞。現在は休止。'],
 ['2004頃','やながせ倉庫','築60年級のビルの小部屋を作家が間借りし、アトリエ兼ショップとして使う自治的な「団地」が育つ。'],
 ['2014','サンデービルヂングマーケット','月2回、柳ヶ瀬アーケードに120〜160店のクラフト作家・飲食・古物が出店する市民マーケット。約50店から10年で拡大。'],
 ['2015','ぎふメディアコスモス 開館','伊東豊雄設計の図書館+ギャラリー複合施設。市民の作品展・文化イベントが日常的に開かれる。'],
 ['2022','岐阜和傘が国の伝統的工芸品に','岐阜提灯(1995年指定)に続く指定。川原町では全国唯一の専門店が職人の後継者育成に取り組む。']
];
function About({go}:{go:(v:View)=>void}){return <><Top title="ABOUT" back go={go}/><main className="content pass-page about-page">
 <section className="pass-hero" style={{backgroundImage:`linear-gradient(#061827a8,#061827e6),url('${homeImages.souko}')`}}><small>ABOUT / GIFU ART & CRAFT</small><h1>市民がつくってきた、<br/>アートのまち。</h1><p>岐阜市では、市民が芸術活動の作り手であり続けてきました。このサイトは、街に散らばるその蓄積をひとつの入口にまとめ、歩いて巡れる形で旅行者に接続するためのものです。</p></section>
 <section><h2>岐阜市に根付いてきた芸術活動</h2><div className="about-timeline">{aboutTimeline.map(x=><div key={x[0]+x[1]}><time>{x[0]}</time><div><b>{x[1]}</b><p>{x[2]}</p></div></div>)}</div><p className="bodycopy">このほかにも、市民公募の岐阜市美術展覧会(市展)が続き、西柳ヶ瀬では毎週土曜の夜、アーケードのネオンサインが再び灯ります。市民アンケートでも、伝統文化工芸は市民が誇る観光資源の上位に挙げられています。</p></section>
 <section><h2>課題:資源はあるのに、入口が散らばっている</h2><p className="bodycopy">これらの場所は、岐阜公園から川原町、司町、柳ヶ瀬、駅まで、ほぼ一本の徒歩動線上に並んでいます。散らばっているのは場所ではなく、情報と運営主体(県・市・民間・市民・NPO)です。一方で観光は有名地点に集中し、岐阜市を訪れる日本人観光客の平均立ち寄り地点数は1.38地点にとどまります。</p><p className="pass-note">※出典:岐阜市観光ビジョン関連調査(モバイル空間統計)、岐阜市アート資源調査(2026年8月・実地確認含む)。</p></section>
 <section><h2>このサイトがすること</h2><div className="about-pillars">
  <article><small>01 / INDEX</small><h3>アート・工芸に特化した入口</h3><p>美術館・ギャラリー・工芸店・市民アートの情報を、ジャンル横断でひとつに集めます。</p><button onClick={()=>go('search')}>場所を探す　›</button></article>
  <article><small>02 / WALK & PASS</small><h3>歩ける動線で巡る</h3><p>徒歩約3kmの動線をルートとして示し、デジタルパス(構想デモ)でまとめて巡れるようにします。</p><button onClick={()=>go('pass')}>ART PASSを見る　›</button></article>
  <article><small>03 / BACK TO MAKERS</small><h3>購入・応援が作り手に届く</h3><p>買い物は各公式ショップへ直接接続。パス売上の一部を作り手に還元する構想です。</p><button onClick={()=>go('shop')}>作り手の品を見る　›</button></article>
 </div></section>
 <DemoNote>本サイトは大学プロジェクトによる構想段階のデモです。掲載施設・取り組みは公開情報と実地確認に基づきますが、最新情報は各公式ページをご確認ください。</DemoNote>
</main></>}

/* ---------- ART PASS バナー・ページ ---------- */
function PassBanner({go}:{go:(v:View)=>void}){return <button className="pass-banner" onClick={()=>go('pass')}><div><small>GIFU ART PASS(構想デモ)</small><h2>美術館も、ギャラリーも、工芸の店も。<br/>1枚のパスで、まとめて巡る。</h2><p>岐阜公園〜川原町〜司町〜柳ヶ瀬〜駅。徒歩でつながるアートの動線を、デジタルパス1枚で。売上の一部は作り手に還元する構想です。</p><span>パスを見る　›</span></div><aside><div className="pass-card-mini"><small>GIFU ART PASS</small><b>1DAY / ¥600</b><i>▣</i><em>この画面を施設で提示(構想)</em></div></aside></button>}
function PassPage({go,set}:{go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void}){return <main className="content pass-page"><section className="pass-hero" style={{backgroundImage:`linear-gradient(#061827a8,#061827e6),url('${homeImages.park}')`}}><small>GIFU ART PASS</small><h1>岐阜のアートを、<br/>1枚で巡るパス。</h1><p>岐阜公園の美術館から、川原町の工芸、柳ヶ瀬の作家スペースまで。徒歩でつながる動線を、スマホのデジタルパスでまとめて楽しむ——その販売導線のデモです。</p><DemoNote>これは大学プロジェクトの構想デモです。実際の販売・決済は行われません。</DemoNote></section>
 <section className="pass-plans"><h2>パスの種類(想定価格の例)</h2><div>{passPlans.map(p=><article key={p.id}><small>{p.name}</small><strong>{p.price}</strong><b>{p.period}</b><p>{p.copy}</p><button onClick={()=>{set({passPlan:p.id});go('passcheckout')}}>このパスを選ぶ(デモ)</button></article>)}</div><p className="pass-note">1DAYは岐阜公園の2館だけで、2DAYは公立3館で、2DAY+は三甲美術館+どれか1館で「元が取れる」想定価格(例)です。</p></section>
 <section className="pass-list"><h2>入館対象(構想中の例)</h2>{passTargets.map(x=><a key={x[0]} href={x[2]} target="_blank" rel="noreferrer"><b>{x[0]}</b><small>{x[1]}</small><span>公式 ↗</span></a>)}<h2>スタンプ・特典(構想中の例)</h2>{passPerkSpots.map(x=><a key={x[0]} href={x[2]} target="_blank" rel="noreferrer"><b>{x[0]}</b><small>{x[1]}</small><span>公式 ↗</span></a>)}<p className="pass-note">※掲載施設は構想中の例であり、各施設と提携・合意したものではありません。</p></section>
 <section className="pass-return"><h2>売上は、作り手に還る。</h2><p>パス売上の一部を、岐阜和傘の後継者育成や、やながせ倉庫の作家など「岐阜のアートの作り手」への支援に充てる構想です。パスを買うことが、そのまま応援になる仕組みを目指します。</p><button onClick={()=>go('maker')}>作り手を知る　›</button></section>
 <section className="pass-how"><h2>使い方(構想)</h2><ol><li>この画面からパスを購入(登録・アプリ不要)</li><li>スマホに表示されるデジタルパスを施設の受付で提示</li><li>スタンプポイントではQRを読み取って巡った記録を残す</li></ol><p className="pass-note">※有償デジタルパスの発行には資金決済法(前払式支払手段)上の整理が必要なため、現段階では構想デモとして表示しています。</p></section>
 <button className="primary" onClick={()=>go('passcheckout')}>購入手続きへ(デモ)</button></main>}
function PassCheckout({go,s,set}:{go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void}){const uid=useId();const [plan,setPlan]=useState(s.passPlan||'1day');const sel=passPlans.find(p=>p.id===plan)!;return <main className="content pass-page"><span className="eyebrow">GIFU ART PASS / DEMO</span><h1 className="page-title">購入手続き(デモ)</h1><DemoNote>UI確認用のデモです。決済は発生せず、入力情報も送信されません。</DemoNote>
 <section className="pass-checkout-card"><h2>1. パスを選ぶ</h2>{passPlans.map(p=><label className="pass-radio" key={p.id}><input type="radio" name={uid+'plan'} checked={plan===p.id} onChange={()=>setPlan(p.id)}/><div><b>{p.name}　{p.price}</b><small>{p.period}</small></div></label>)}</section>
 <section className="pass-checkout-card"><h2>2. お支払い方法(デモ)</h2>{['クレジットカード(デモ)','コード決済(デモ)','コンビニ支払い(デモ)'].map((x,i)=><label className="pass-radio" key={x}><input type="radio" name={uid+'pay'} defaultChecked={i===0}/><div><b>{x}</b></div></label>)}<p className="pass-note">登録・アカウント作成は不要です。パスはこの端末に保存されます(構想)。</p></section>
 <section className="pass-checkout-card pass-summary"><span>{sel.name}<b>{sel.price}</b></span><span>手数料<b>¥0</b></span><strong>合計(税込)<b>{sel.price}</b></strong></section>
 <button className="primary" onClick={()=>{set({passOwned:true,passPlan:plan});go('passdone')}}>デモ購入を確定する</button><button className="secondary" onClick={()=>go('pass')}>パスの説明に戻る</button></main>}
function PassDone({go,s}:{go:(v:View)=>void;s:AppState}){const sel=passPlans.find(p=>p.id===s.passPlan)||passPlans[0];return <main className="content pass-page pass-done"><span className="eyebrow">GIFU ART PASS / DEMO</span><h1 className="page-title">パスが発行されました(デモ)</h1>
 <section className="pass-card-big"><small>GIFU ART PASS</small><h2>{sel.name}</h2><b>{sel.period}</b><div className="pass-qr">▣</div><p>PASS ID：GAP-DEMO-0001</p><em>施設の受付でこの画面を提示(構想)</em></section>
 <DemoNote>これはUI確認用のデモパスです。実際の入館には使えません。</DemoNote>
 <section className="pass-list"><h2>このパスで巡れる場所(構想中の例)</h2>{passTargets.map(x=><a key={x[0]} href={x[2]} target="_blank" rel="noreferrer"><b>{x[0]}</b><small>{x[1]}</small><span>公式 ↗</span></a>)}</section>
 <button className="primary" onClick={()=>go('walk')}>パスで巡るルートを見る</button><button className="secondary" onClick={()=>go('home')}>ホームへ戻る</button></main>}

/* ---------- モバイル各ページ ---------- */
function MobileHome({go}:{go:(v:View)=>void}){const mosaic=[{title:'岐阜公園、美術館のある入口',place:'常設・岐阜公園',image:homeImages.park,to:'experience' as View},{title:'やながせ倉庫、作家の団地',place:'常設・柳ヶ瀬',image:homeImages.souko,to:'spot' as View},{title:'ネオンが灯る、土曜の西柳ヶ瀬',place:'毎週土曜・柳ヶ瀬本通り',image:homeImages.starSax,to:'eventlist' as View}];return <><Top title="GIFU ART & CRAFT" go={go}/><main className="content mobile-tourism-home"><HomeSlideshow go={go}/><section className="mobile-manifesto"><span>ABOUT GIFU CITY</span><h1>市民がつくってきた、<br/>アートのまち。</h1><p>大正8年創業の画廊、作家が集まる「団地」、<br/>月2回のクラフト市。岐阜市には、市民が<br/>育ててきた芸術活動がいまも続いています。</p><button className="mobile-text-link" onClick={()=>go('about')}>このサイトについて　›</button></section><PassBanner go={go}/><section className="mobile-editorial"><header><span>NOW</span><h2>今から行ける岐阜市。</h2></header><div className="mobile-mosaic">{mosaic.map((x,i)=><button key={x.title} className={i===0?'large':''} onClick={()=>go(x.to)}><img src={x.image} alt=""/><div><small>{x.place}</small><b>{x.title}</b></div></button>)}</div><button className="mobile-text-link" onClick={()=>go('eventlist')}>今じゃない催しも見る(イベント一覧)　›</button></section><button className="mobile-wide-story" style={{backgroundImage:`linear-gradient(90deg,#071827e8,#07182742),url('${homeImages.wallart}')`}} onClick={()=>go('experience')}><small>CIVIC ART / TONYAMACHI</small><h2>壁に描かれた空が、<br/>本物の空とつながる。</h2><span>問屋町のウォールアートを見る　›</span></button><section className="mobile-experiences"><header><span>EXPERIENCE</span><h2>歩いて出会う、岐阜市のアート。</h2></header><div>{[experienceItems[0],experienceItems[4],experienceItems[6]].map(x=><button key={x.title} onClick={()=>go('experience')}><img src={x.image} alt=""/><b>{x.title}</b><small>{x.place} ›</small></button>)}</div></section><button className="mobile-shop-banner" onClick={()=>go('shop')}><div><small>SHOP / MAKERS</small><h2>買うことが、<br/>作り手に届く。</h2><span>岐阜の手仕事を見る　›</span></div><img src={homeImages.wagasa} alt="岐阜和傘"/></button><footer className="site-disclaimer"><p>本サイトは大学プロジェクトによる構想段階のデモです。「デモ」「構想」と記載の機能・価格・特典は実在しません。実在施設の営業時間・料金・予約は各公式ページをご確認ください。一部の写真・画像はイメージ(AI生成画像を含む)です。</p></footer></main></>}
function EventRow({x,go}:{x:EventItem;go:(v:View)=>void}){return <button className="list-card" onClick={()=>x.toAbout?go('about'):window.open(x.url,'_blank')}><img src={x.image} alt=""/><div><b>{x.title}</b><small>{x.date}　{x.place}</small></div><i>›</i></button>}
function EventList({go}:{go:(v:View)=>void}){const g=eventGroups();return <><Top title="EVENT" back go={go}/><main className="content"><span className="eyebrow">GIFU CITY EVENTS</span><h1 className="page-title">今から行ける</h1><p className="lead">開催中・定期開催の催しです。日程は必ず公式情報をご確認ください。</p>{g.now.map(x=><EventRow key={x.title} x={x} go={go}/>)}{g.later.length>0&&<><h3 className="event-group-title">開催時期をご確認ください</h3>{g.later.map(x=><EventRow key={x.title} x={x} go={go}/>)}</>}<h3 className="event-group-title">いまは開催していない</h3>{g.past.map(x=><EventRow key={x.title} x={x} go={go}/>)}<p className="pass-note">休止中の取り組みも、岐阜市の芸術活動の歴史として ABOUT で紹介しています。</p></main></>}
function Walk({go,notice}:{go:(v:View)=>void;notice:(t:string)=>void}){return <><Top title="アートの徒歩動線" back go={go}/><main className="content walk"><p className="route-intro">岐阜公園 → 川原町 → 司町 → 柳ヶ瀬 → 岐阜駅　｜　徒歩約3km(見学時間別)</p><RouteMap/><ol>{walkStops.map((x,i)=><li key={x.name}><button onClick={()=>go(i===3?'spot':'experience')}><span>{i+1}</span><div><b>{x.name}</b><small>{x.sub}</small></div><em>›</em></button></li>)}</ol><a className="primary map-primary" href={walkDirectionsUrl} target="_blank" rel="noreferrer">Google Mapsでこのルートを歩く</a><button className="secondary" onClick={()=>notice('ルートをこの端末に保存しました(登録不要)。')}>ルートを保存する</button></main></>}
function Culture({go}:{go:(v:View)=>void}){return <><Top title="CULTURE" back go={go}/><main className="content"><div className="culture-photo"/><span className="eyebrow">GIFU CITY ART & CRAFT</span><h1 className="page-title">岐阜市の工芸と建築を、<br/>旅の入口に。</h1><p className="bodycopy">岐阜和傘(2022年伝統的工芸品指定)、岐阜提灯(1995年指定)。伊東豊雄のメディアコスモスと安藤忠雄の長良川国際会議場。大正8年創業の柳ヶ瀬画廊。この街には、歩いて出会える芸術の層があります。</p><hr/><h3>公式情報</h3><p className="bodycopy">工芸の特徴、作り手、見学・体験は公式の最新情報を確認できます。</p><OfficialLink href={officialLinks.craft} className="primary">岐阜の伝統工芸品を見る</OfficialLink><button className="secondary" onClick={()=>go('shop')}>作り手の品を見る</button></main></>}
function MobileExperienceList({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){
 const [category,setCategory]=useState('すべて');
 const [query,setQuery]=useState('');
 const shown=experienceItems.filter(x=>(category==='すべて'||x.category===category)&&(`${x.title}${x.place}${x.category}`.includes(query)));
 return <><Top title="GIFU ART & CRAFT" go={go}/><main className="m-exp-index">
  <section className="m-exp-hero" style={{backgroundImage:`linear-gradient(#06182765,#061827d8),url('${homeImages.park}')`}}><span>EXPERIENCE</span><h1>体験する</h1><p>岐阜市の徒歩動線で出会う、アートと工芸。</p></section>
  <section className="m-exp-finder"><label><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="キーワードで探す"/><span>⌕</span></label></section>
  <div className="m-exp-categories">{experienceCategories.map(x=><button key={x.label} className={category===x.label?'active':''} onClick={()=>setCategory(x.label)}><span>{x.icon}</span><b>{x.label}</b></button>)}</div>
  <section className="m-exp-results"><header><b>{category==='すべて'?'すべての体験・見どころ':category}</b><small>{shown.length}件</small></header>{shown.map(x=><article key={x.title}><button className="m-exp-card-main" onClick={()=>{if(x.spot)go('spot');else if(x.makerId){set({makerId:x.makerId});go('maker')}else window.open(x.url,'_blank')}}><img src={x.image} alt=""/><div><em>{x.category}</em><h2>{x.title}</h2><p>⌖ {x.place}</p><strong>{x.info}</strong></div></button><OfficialLink href={x.url}>公式情報</OfficialLink></article>)}</section>
 </main></>
}
function Shop({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){return <><Top title="GIFU ART & CRAFT" go={go}/><main className="content m-shop"><section className="m-shop-cover"><span>SHOP</span><h1>買うことが、<br/>作り手に届く。</h1><p>実在する店舗・工房の公式ページへご案内します。購入は作り手への直接の応援です。</p><button onClick={()=>go('shoplist')}>作り手の品を探す　›</button></section><section className="m-shop-block"><header><h2>作り手から選ぶ</h2><button onClick={()=>go('shoplist')}>すべて見る</button></header><div className="m-maker-row">{makers.map(m=><button key={m.id} onClick={()=>{set({makerId:m.id});go('maker')}}><img src={m.image} alt=""/><b>{m.name}</b><small>{m.area}</small></button>)}</div></section><section className="m-shop-block"><header><h2>岐阜市の手仕事</h2><button onClick={()=>go('shoplist')}>すべて見る</button></header><a className="m-shop-feature" href={officialLinks.wagasa} target="_blank" rel="noreferrer"><img src={homeImages.wagasa} alt="岐阜和傘"/><div><small>川原町・和傘CASA</small><b>岐阜和傘</b><span>公式ショップへ　↗</span></div></a></section><OfficialLink href={officialLinks.gifts} className="m-shop-story"><img src={homeImages.craft} alt="県産品"/><div><small>岐阜駅・アクティブG</small><b>THE GIFTS SHOP</b><span>公式サイトへ</span></div></OfficialLink><OfficialDirectory compact/></main></>}
function ShopList({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){return <><Top title="作り手の品" back go={go}/><main className="content m-catalog"><div className="m-filter-row"><span>実在の店舗・工房のみを掲載。価格・在庫は公式ページをご確認ください。</span></div><section className="m-product-grid">{shopItems.map(x=><a key={x.title} href={x.url} target="_blank" rel="noreferrer"><div><img src={x.image} alt={x.title}/><span>公式</span><i>↗</i></div><small>{x.tag} / {x.maker}</small><b>{x.title}</b><strong>{x.price}</strong></a>)}</section><h3 className="m-catalog-sub">作り手を知る</h3>{makers.map(m=><button key={m.id} className="menu-row" onClick={()=>{set({makerId:m.id});go('maker')}}><span className="menu-icon">✤</span><div><b>{m.name}</b><small>{m.craft}</small></div><i>›</i></button>)}</main></>}
function Maker({go,s}:{go:(v:View)=>void;s:AppState}){const m=makers.find(x=>x.id===s.makerId)||makers[0];return <><Top title="作り手" back go={go}/><main className="content m-maker"><div className="m-maker-hero"><img src={m.image} alt={m.name}/></div><section className="m-maker-profile"><img src={m.image} alt=""/><small>{m.craft}</small><h1>{m.name}</h1><p>{m.area}</p></section><article><h2>{m.title}</h2><p>{m.body}</p><p className="maker-return"><b>作り手への還元：</b>{m.back}</p></article>{m.links.map(x=><OfficialLink key={x[0]} href={x[1]} className="secondary official-link">{x[0]}</OfficialLink>)}<section className="m-related-products"><header><h2>ほかの作り手</h2></header><div>{makers.filter(x=>x.id!==m.id).map(x=><a key={x.id} href={x.links[0][1]} target="_blank" rel="noreferrer"><img src={x.image} alt=""/><b>{x.name}</b><small>{x.craft}</small></a>)}</div></section></main></>}
const soukoPhotos=[homeImages.souko,homeImages.souko2,homeImages.souko3,homeImages.soukoBoard];
function SpotGallery(){const [photo,setPhoto]=useState(soukoPhotos[0]);return <div className="spot-gallery"><img className="spot-main" src={photo} alt="やながせ倉庫(2026年8月実地撮影)"/><div className="spot-thumbs">{soukoPhotos.map((x,i)=><button key={x} className={photo===x?'active':''} onClick={()=>setPhoto(x)}><img src={x} alt={`${i+1}枚目を表示`}/></button>)}</div></div>}
function Spot({go,s,set,notice}:{go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void;notice:(t:string)=>void}){return <><Top title="スポット詳細" back go={go}/><main className="content"><SpotGallery/><span className="eyebrow">CIVIC ART / YANAGASE</span><h1 className="page-title">やながせ倉庫</h1><p className="lead">築60年級のビルまるごと、作家の「団地」。</p><div className="facts"><span>⌖ 柳ヶ瀬アーケード内</span><span>営業は店舗ごと</span></div><p className="bodycopy">2004年頃から改装が始まり、アーティスト・クリエイターが小さな部屋を間借りしてアトリエ兼ショップとして使う自治的な空間。雑貨店・レコード店・ハンドメイド作家・イラストレーターが混在し、入口の掲示板には入居作家の名刺やフライヤーがびっしり貼られています(写真は2026年8月の実地撮影)。</p><p className="bodycopy">ここでの購入は、その場で作家本人に届きます。</p><button className="primary" onClick={()=>{set({saved:!s.saved});notice(s.saved?'保存を解除しました。':'この端末に保存しました(登録不要)。')}}>{s.saved?'保存を解除する':'♡ 保存する'}</button><a className="secondary official-link" href={officialLinks.soukoMap} target="_blank" rel="noreferrer">地図で場所を見る</a><button className="secondary" onClick={()=>go('walk')}>この場所を含むルートを見る</button></main></>}
function MapView({go}:{go:(v:View)=>void}){const [cat,setCat]=useState('すべて');const cats=['すべて','美術館・博物館','建築','工芸','市民アート','まち歩き'];const shown=citySpots.filter(x=>cat==='すべて'||x.cat===cat);return <><Top title="マップで探す" go={go}/><main className="content map"><div className="chipbar">{cats.map(c=>cat===c?<b key={c}>{c}</b>:<button key={c} onClick={()=>setCat(c)}>{c}</button>)}</div><LiveWalkMap compact/>{shown.map(x=><a className="map-spot-row" key={x.name} href={x.url} target="_blank" rel="noreferrer"><div><b>{x.name}</b><small>{x.cat}　⌖ {x.area}</small></div><span>↗</span></a>)}</main></>}
function Search({go}:{go:(v:View)=>void}){const [query,setQuery]=useState('');const hits=query?citySpots.filter(x=>`${x.name}${x.area}${x.cat}`.includes(query)):[];return <><Top title="検索" back go={go}/><main className="content form"><label>キーワード<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="施設・エリア・ジャンルを検索"/></label><div className="chipbar"><b>すべて</b><button onClick={()=>go('map')}>場所</button><button onClick={()=>go('eventlist')}>イベント</button><button onClick={()=>go('experience')}>体験</button></div>{query&&hits.length===0&&<p className="bodycopy">「{query}」に一致する場所は見つかりませんでした。</p>}{hits.map(x=><a className="map-spot-row" key={x.name} href={x.url} target="_blank" rel="noreferrer"><div><b>{x.name}</b><small>{x.cat}　⌖ {x.area}</small></div><span>↗</span></a>)}</main></>}

/* ---------- PC(デスクトップ) ---------- */
type HomeCard={title:string;sub?:string;image:string;tag?:string;to:View};
function HomeFeatureCard({card,go}:{card:HomeCard;go:(v:View)=>void}){return <button className="gl-feature-card" onClick={()=>go(card.to)}><img src={card.image} alt=""/><span className="gl-card-shade"/><div>{card.tag&&<em>{card.tag}</em>}<b>{card.title}</b>{card.sub&&<small>{card.sub}</small>}</div></button>}
function HomeShelf({eyebrow,title,copy,cards,go,more,variant='standard'}:{eyebrow?:string;title:string;copy:string;cards:HomeCard[];go:(v:View)=>void;more:View;variant?:'events'|'picks'|'walk'|'experience'|'shop'|'standard'}){return <section className={`gl-shelf gl-${variant}`}><header><span>{eyebrow}</span><h2>{title}</h2><p>{copy}</p><button onClick={()=>go(more)}>もっと見る　›</button></header><div className="gl-shelf-grid">{cards.map((card,i)=><HomeFeatureCard key={i} card={card} go={go}/>)}</div></section>}
function PcHome({go}:{go:(v:View)=>void}){
 const nowPicks:HomeCard[]=[{tag:'常設',title:'岐阜城の足元に、美術館が2つ。',sub:'歴史博物館・加藤栄三・東一記念美術館',image:homeImages.park,to:'experience'},{tag:'常設',title:'やながせ倉庫、作家の団地。',sub:'柳ヶ瀬・営業は店舗ごと',image:homeImages.souko,to:'spot'},{tag:'常設',title:'伊東豊雄のメディアコスモス。',sub:'司町・入館無料',image:homeImages.mediacosmos,to:'experience'},{tag:'毎週土曜',title:'スタープレイス柳ヶ瀬 ネオン点灯',sub:'西柳ヶ瀬・夜',image:homeImages.starSax,to:'eventlist'}];
 const cultureWalk:HomeCard[]=[{title:'岐阜公園から駅まで、アートの一本道。',sub:'徒歩約3km・美術館/工芸/市民アート',image:homeImages.park,to:'walk'},{title:'安藤忠雄と伊東豊雄を歩いて見る。',sub:'長良川国際会議場・メディアコスモス',image:homeImages.architecture,to:'walk'},{title:'問屋町のウォールアート',sub:'壁の空が、本物の空とつながる',image:homeImages.wallart,to:'walk'},{title:'川原町の町家めぐり',sub:'旧川湊の街並み',image:homeImages.machiya,to:'walk'}];
 const cultureExperience:HomeCard[]=[{tag:'工芸',title:'岐阜和傘の店を訪ねる',sub:'川原町・和傘CASA',image:homeImages.wagasa,to:'experience'},{title:'歴史博物館で楽市楽座を歩く',sub:'岐阜公園・大人310円',image:homeImages.park,to:'experience'},{title:'市民展示に出会う',sub:'メディアコスモスの展示スペース',image:homeImages.mediacosmos,to:'experience'},{title:'問屋町のウォールアート',sub:'屋外・見学自由',image:homeImages.wallart,to:'experience'}];
 const peopleShop:HomeCard[]=[{tag:'岐阜和傘',title:'和傘CASA / CASA stella',sub:'川原町・2022年 伝統的工芸品',image:homeImages.wagasa,to:'shop'},{title:'株式会社オゼキ(岐阜提灯)',sub:'1995年 伝統的工芸品',image:homeImages.paper,to:'shop'},{title:'やながせ倉庫の作家たち',sub:'柳ヶ瀬・現地で直接',image:homeImages.souko,to:'shop'},{title:'THE GIFTS SHOP',sub:'岐阜駅・アクティブG',image:homeImages.craft,to:'shop'}];
 return <main className="pc-page gl-home gl-home-simple"><HomeSlideshow go={go}/><section className="gl-manifesto"><span>ABOUT GIFU CITY</span><h1>市民がつくってきた、アートのまち。</h1><p>大正8年創業の画廊、作家の「団地」やながせ倉庫、月2回のクラフト市——岐阜市には市民が育ててきた芸術活動がいまも続いています。このサイトはそれをひとつの入口にまとめ、歩いて巡れる形で旅行者に接続します。<button className="gl-about-link" onClick={()=>go('about')}>このサイトについて ›</button></p></section><PassBanner go={go}/><HomeShelf eyebrow="今から行ける岐阜市" title="NOW" copy="開催中の催しと、いつでも見られる場所。今じゃない催しもイベント一覧から。" cards={nowPicks} go={go} more="eventlist" variant="events"/><HomeShelf eyebrow="文化を歩いて知る" title="WALK" copy="美術館と工芸をつなぐ、駅までの一本道。" cards={cultureWalk} go={go} more="walk" variant="walk"/><HomeShelf eyebrow="文化に触れる" title="EXPERIENCE" copy="歩いて出会う、岐阜市のアートと工芸。" cards={cultureExperience} go={go} more="experience" variant="experience"/><HomeShelf eyebrow="買うことが作り手に届く" title="SHOP" copy="人と物語が見える、岐阜市の手仕事。" cards={peopleShop} go={go} more="shoplist" variant="shop"/><section className="gl-info gl-info-simple"><div><h3>お知らせ</h3><p>2026.08.29　サイト構成を岐阜市の徒歩動線圏に刷新しました</p><p>2026.08.28　GIFU ART PASS(構想デモ)を公開しました</p></div><div><h3>GIFU ART PASS(構想デモ)</h3><p>美術館・ギャラリー・工芸の店をまとめて巡るデジタルパス。売上の一部は作り手に還元する構想です。</p><label><button onClick={()=>go('pass')}>パスを見る ›</button></label></div></section><footer className="gl-footer gl-footer-simple"><div><b>✤ GIFU ART & CRAFT</b><p>岐阜市に根付いたアートと工芸を、ひとつの入口に。</p></div>{[['ABOUT','このサイトについて'],['EVENT','季節の催し'],['WALK','文化を歩く'],['EXPERIENCE','文化に触れる'],['SHOP','作り手の品']].map(x=><div key={x[0]}><b>{x[0]}</b><small>{x[1]}</small></div>)}<p className="gl-copy">本サイトは大学プロジェクトによる構想段階のデモです。「デモ」「構想」と記載の機能・価格・特典は実在しません。実在施設の情報は各公式ページをご確認ください。一部の写真・画像はイメージ(AI生成画像を含む)です。</p></footer></main>
}
function PcEventCard({x,go,badge}:{x:EventItem;go:(v:View)=>void;badge?:string}){return <button onClick={()=>x.toAbout?go('about'):window.open(x.url,'_blank')}><div><img src={x.image} alt=""/></div>{badge&&<span>{badge}</span>}<h2>{x.title}</h2><p>{x.date}　{x.place}</p></button>}
function PcEventIndex({go}:{go:(v:View)=>void}){const g=eventGroups();return <main className="pc-page editorial-index event-index-pc"><section className="event-season"><div><span>EVENT</span><h1>今から行ける、<br/>岐阜市の催し。</h1><p>開催中の催しと、毎週・毎月の定期開催。</p></div><button onClick={()=>go('map')}>地図で見る</button></section><section className="event-poster-grid">{g.now.map(x=><PcEventCard key={x.title} x={x} go={go}/>)}</section>{g.later.length>0&&<><h3 className="event-group-title-pc">開催時期をご確認ください</h3><section className="event-poster-grid">{g.later.map(x=><PcEventCard key={x.title} x={x} go={go}/>)}</section></>}<h3 className="event-group-title-pc">いまは開催していない</h3><section className="event-poster-grid">{g.past.map(x=><PcEventCard key={x.title} x={x} go={go} badge="休止中"/>)}</section><p className="event-note-pc">日程・会場は変更される場合があります。お出かけ前に各公式情報をご確認ください。休止中の取り組みは ABOUT でも紹介しています。</p></main>}
function PcWalkIndex({go}:{go:(v:View)=>void}){return <main className="pc-page editorial-index walk-index-pc"><section className="walk-cover" style={{backgroundImage:`linear-gradient(90deg,#071827ed,#07182728),url('${homeImages.park}')`}}><span>WALK</span><h1>岐阜公園から駅まで、<br/>アートの一本道。</h1><p>美術館、町家、現代建築、作家の団地。徒歩約3kmの動線。</p><a className="walk-cover-cta" href={walkDirectionsUrl} target="_blank" rel="noreferrer">Google Mapsでルートを開く　↗</a></section><section className="walk-intro"><div><small>おすすめルート</small><h2>美術館と工芸をつなぐ、<br/>半日の徒歩動線。</h2><p>{walkStops.map(x=>x.name).join(' → ')}</p><ol className="walk-stops-pc">{walkStops.map((x,i)=><li key={x.name}><span>{i+1}</span><div><b>{x.name}</b><small>{x.sub}</small></div></li>)}</ol></div><RouteMap/></section><section className="route-grid">{[{t:'安藤忠雄と伊東豊雄を歩いて見る',s:'長良川国際会議場・メディアコスモス',img:homeImages.architecture},{t:'川原町の町家めぐり',s:'旧川湊の街並みと工芸店',img:homeImages.machiya},{t:'柳ヶ瀬、作家の団地へ',s:'やながせ倉庫・柳ヶ瀬画廊',img:homeImages.souko},{t:'問屋町のウォールアート',s:'壁の空と本物の空',img:homeImages.wallart}].map(x=><button key={x.t} onClick={()=>go('walk')}><img src={x.img} alt=""/><div><h2>{x.t}</h2><p>{x.s}</p></div></button>)}</section></main>}
function PcExperienceList({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){
 const [category,setCategory]=useState('すべて');
 const [query,setQuery]=useState('');
 const shown=experienceItems.filter(x=>(category==='すべて'||x.category===category)&&(`${x.title}${x.place}${x.category}`.includes(query)));
 return <main className="pc-page exp-index">
  <section className="exp-hero" style={{backgroundImage:`linear-gradient(90deg,#061827bd,#06182745),url('${homeImages.park}')`}}><div><span>EXPERIENCE</span><h1>体験する</h1><p>岐阜市の徒歩動線で出会う、アートと工芸。</p></div><div className="exp-searchbar"><label>⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="キーワードで探す(例:和傘、美術館、建築)"/></label><button onClick={()=>document.querySelector('.exp-results')?.scrollIntoView({behavior:'smooth'})}>探す</button></div></section>
  <nav className="exp-categories" aria-label="体験カテゴリー">{experienceCategories.map(x=><button key={x.label} className={category===x.label?'active':''} onClick={()=>setCategory(x.label)}><span>{x.icon}</span><b>{x.label}</b></button>)}</nav>
  <section className="exp-results"><header><div><small>GIFU CITY</small><h2>{category==='すべて'?'岐阜市で出会う、アートと工芸':category}</h2></div><p>{shown.length}件</p></header><div className="exp-grid">{shown.map(x=><article key={x.title}><button className="exp-card-main" onClick={()=>{if(x.spot)go('spot');else if(x.makerId){set({makerId:x.makerId});go('maker')}else window.open(x.url,'_blank')}}><div><img src={x.image} alt=""/><em>{x.category}</em></div><section><h3>{x.title}</h3><p>⌖ {x.place}</p><footer><strong>{x.info}</strong></footer></section></button><OfficialLink href={x.url}>公式情報</OfficialLink></article>)}</div></section>
  <section className="exp-season"><div><small>GIFU ART PASS</small><h2>まとめて巡るなら、パスで。</h2><p>美術館・ギャラリー・工芸の店を1枚で巡るデジタルパス(構想デモ)。</p><button onClick={()=>go('pass')}>パスを見る　›</button></div><div>{[homeImages.park,homeImages.machiya,homeImages.souko,homeImages.mediacosmos].map((x,i)=><img key={x} src={x} alt={['岐阜公園','川原町','柳ヶ瀬','司町'][i]}/>)}</div></section>
 </main>
}
function PcShopPage({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){return <main className="pc-page pc-commerce-home"><section className="pc-commerce-hero"><img src={homeImages.wagasa} alt="岐阜和傘"/><div><small>GIFU ART & CRAFT / SHOP</small><h1>買うことが、<br/>作り手に届く。</h1><p>実在する店舗・工房の公式ページへ案内します。購入は作り手への直接の応援です。</p><button onClick={()=>go('shoplist')}>作り手の品を見る　›</button></div></section><section className="pc-shop-promises">{[['作り手で選ぶ','誰が作ったかから辿る'],['公式に買う','各公式ショップへ接続'],['パスで応援する','売上の一部を還元(構想)']].map((x,i)=><button key={x[0]} onClick={()=>i===2?go('pass'):go('shoplist')}><span>{String(i+1).padStart(2,'0')}</span><b>{x[0]}<br/>{x[1]}</b><i>›</i></button>)}</section><section className="pc-makers"><header><div><small>MAKERS</small><h2>実在する作り手・店</h2></div><button onClick={()=>go('shoplist')}>品の一覧</button></header><div>{makers.map(m=><button className="pc-maker-link" key={m.id} onClick={()=>{set({makerId:m.id});go('maker')}}><img src={m.image} alt=""/><b>{m.name}</b><small>{m.craft}</small></button>)}<a href={officialLinks.gifts} target="_blank" rel="noreferrer"><img src={homeImages.craft} alt=""/><b>THE GIFTS SHOP</b><small>県産品拠点・岐阜駅 ↗</small></a></div></section><OfficialDirectory/></main>}
function PcShopList({go,set}:{go:(v:View)=>void;set:(p:Partial<AppState>)=>void}){return <main className="pc-page pc-catalog"><header><small>SHOP / MAKERS</small><h1>作り手の品 <span>実在の店舗・工房のみ</span></h1><p>品を選び、作り手を知り、公式販売ページへ。価格・在庫は公式ページをご確認ください。</p></header><aside><b>作り手</b>{makers.map(m=><button key={m.id} onClick={()=>{set({makerId:m.id});go('maker')}}>{m.name}</button>)}<hr/><b>ジャンル</b>{['岐阜和傘','岐阜提灯','クラフト','県産品'].map(x=><label key={x}><input type="checkbox" defaultChecked readOnly/>{x}</label>)}</aside><section><div className="pc-catalog-tools"><div><b>すべて</b></div><small>価格・在庫は公式ページを優先</small></div><div className="pc-catalog-grid">{shopItems.map(x=><article key={x.title}><button onClick={()=>{if(x.makerId){set({makerId:x.makerId});go('maker')}else window.open(x.url,'_blank')}} aria-label={`${x.title}の作り手を見る`}><div><img src={x.image} alt=""/><span>公式</span></div><small>{x.tag} / {x.maker}</small><h2>{x.title}</h2><b>{x.price}</b></button><OfficialLink href={x.url}>公式ページ</OfficialLink></article>)}</div></section></main>}
function PcMaker({go,s}:{go:(v:View)=>void;s:AppState}){const m=makers.find(x=>x.id===s.makerId)||makers[0];return <main className="pc-page pc-maker-page"><section className="pc-maker-cover"><div><small>MAKER / {m.id.toUpperCase()}</small><h1>{m.name}</h1><p>{m.title}</p><OfficialLink href={m.links[0][1]}>{m.links[0][0]}</OfficialLink></div><div className="pc-maker-visual"><img src={m.image} alt={m.name}/><img src={homeImages.craft} alt=""/></div></section><section className="pc-maker-bio"><article><small>STORY</small><h2>{m.title}</h2><p>{m.body}</p><p className="maker-return"><b>作り手への還元：</b>{m.back}</p></article><dl><div><dt>名称</dt><dd>{m.name}</dd></div><div><dt>場所</dt><dd>{m.area}</dd></div><div><dt>分野</dt><dd>{m.craft}</dd></div><div><dt>公式情報</dt><dd>{m.links.map(x=><OfficialLink key={x[0]} href={x[1]} className="pc-maker-dd-link">{x[0]}</OfficialLink>)}</dd></div></dl></section><PageOfficialLinks title="関連する公式情報" items={m.links as [string,string][]}/></main>}
function PcSpot({go,s,set,notice}:{go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void;notice:(t:string)=>void}){return <main className="pc-page pc-spot-page"><div className="pc-spot-grid"><SpotGallery/><div><span className="eyebrow">CIVIC ART / YANAGASE</span><h1>やながせ倉庫</h1><p className="lead">築60年級のビルまるごと、作家の「団地」。</p><p>2004年頃から改装が始まり、アーティスト・クリエイターが小さな部屋を間借りしてアトリエ兼ショップとして使う自治的な空間。雑貨店・レコード店・ハンドメイド作家・イラストレーターが混在し、入口の掲示板には入居作家の名刺やフライヤーがびっしり貼られています(写真は2026年8月の実地撮影)。</p><p><b>ここでの購入は、その場で作家本人に届きます。</b></p><div className="facts"><span>⌖ 柳ヶ瀬アーケード内</span><span>営業は店舗ごと</span></div><button className="primary" onClick={()=>{set({saved:!s.saved});notice(s.saved?'保存を解除しました。':'この端末に保存しました(登録不要)。')}}>{s.saved?'保存を解除する':'♡ 保存する'}</button><a className="secondary official-link" href={officialLinks.soukoMap} target="_blank" rel="noreferrer">地図で場所を見る</a><button className="secondary" onClick={()=>go('walk')}>この場所を含むルートを見る</button></div></div></main>}

function DesktopMenu({go,close}:{go:(v:View)=>void;close:()=>void}){const groups:[string,[View,string,string][]][]=[['楽しみ方',[['about','ABOUT','このサイトについて'],['pass','ART PASS','パスでまとめて巡る(デモ)'],['eventlist','EVENT','季節の催し'],['walk','WALK','文化を歩いて知る'],['experience','EXPERIENCE','文化に触れる'],['shop','SHOP','作り手の品']]],['便利な機能',[['search','SEARCH','キーワード検索'],['map','MAP','地図から探す']]]];const jump=(v:View)=>{go(v);close()};return <div className="desktop-menu-layer" role="dialog" aria-modal="true" aria-label="サイトメニュー"><button className="desktop-menu-backdrop" onClick={close} aria-label="メニューを閉じる"/><aside className="desktop-menu-panel"><header><div><span>✤</span><div><b>GIFU ART & CRAFT</b><small>サイトメニュー</small></div></div><button onClick={close} aria-label="閉じる">×</button></header><section>{groups.map(([title,items])=><div className="desktop-menu-group" key={title}><h2>{title}</h2>{items.map(([v,en,ja])=><button key={v} onClick={()=>jump(v)}><span>{ja}</span><small>{en}</small><i>›</i></button>)}</div>)}</section><footer><button onClick={()=>jump('home')}>ホームへ</button><button onClick={()=>jump('pass')}>ART PASS</button></footer></aside></div>}
function DesktopNav({view,go,onMenu}:{view:View;go:(v:View)=>void;onMenu:()=>void}){const links:[View,string,string][]=[['eventlist','催し','EVENT'],['walk','歩く','WALK'],['experience','体験','EXPERIENCE'],['shop','買う','SHOP']];return <header className="desktop-nav"><button className="desk-brand" onClick={()=>go('home')}>GIFU ART & CRAFT</button><span className="desk-tagline">岐阜市のアートと工芸を、ひとつの入口に</span><button className="desk-search" onClick={()=>go('search')}>場所・体験・イベントを検索　⌕</button><nav>{links.map(([v,ja,en])=><button key={v} className={view===v?'selected':''} onClick={()=>go(v)}><span>{ja}</span><small>{en}</small></button>)}</nav><div className="desk-tools"><button className="desk-pass" onClick={()=>go('pass')}>▣<small>ART PASS</small></button><button onClick={onMenu} aria-haspopup="dialog">☰<small>メニュー</small></button></div></header>}

function DesktopReference({view,go,s,set,notice}:{view:View;go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void;notice:(t:string)=>void}){
 if(view==='home')return <PcHome go={go}/>;
 if(view==='about')return <div className="pc-page pass-shell"><About go={go}/></div>;
 if(view==='pass')return <div className="pc-page pass-shell"><PassPage go={go} s={s} set={set}/></div>;
 if(view==='passcheckout')return <div className="pc-page pass-shell"><PassCheckout go={go} s={s} set={set}/></div>;
 if(view==='passdone')return <div className="pc-page pass-shell"><PassDone go={go} s={s}/></div>;
 if(view==='eventlist')return <PcEventIndex go={go}/>;
 if(view==='walk')return <PcWalkIndex go={go}/>;
 if(view==='experience')return <PcExperienceList go={go} set={set}/>;
 if(view==='shop')return <PcShopPage go={go} set={set}/>;
 if(view==='shoplist')return <PcShopList go={go} set={set}/>;
 if(view==='maker')return <PcMaker go={go} s={s}/>;
 if(view==='spot')return <PcSpot go={go} s={s} set={set} notice={notice}/>;
 if(view==='culture')return <div className="pc-page pass-shell"><Culture go={go}/></div>;
 if(view==='map')return <div className="pc-page pass-shell"><MapView go={go}/></div>;
 if(view==='search')return <div className="pc-page pass-shell"><Search go={go}/></div>;
 return <PcHome go={go}/>;
}
function Screen({view,go,s,set,notice}:{view:View;go:(v:View)=>void;s:AppState;set:(p:Partial<AppState>)=>void;notice:(t:string)=>void}){const p={home:<MobileHome go={go}/>,about:<About go={go}/>,pass:<PassPage go={go} s={s} set={set}/>,passcheckout:<PassCheckout go={go} s={s} set={set}/>,passdone:<PassDone go={go} s={s}/>,eventlist:<EventList go={go}/>,walk:<Walk go={go} notice={notice}/>,culture:<Culture go={go}/>,experience:<MobileExperienceList go={go} set={set}/>,shop:<Shop go={go} set={set}/>,shoplist:<ShopList go={go} set={set}/>,maker:<Maker go={go} s={s}/>,spot:<Spot go={go} s={s} set={set} notice={notice}/>,map:<MapView go={go}/>,search:<Search go={go}/>}[view];return <div className={`view view-${view}`}>{p}<Nav view={view} go={go}/></div>}
const ALL_VIEWS:View[]=['home','about','pass','passcheckout','passdone','eventlist','walk','culture','experience','shop','shoplist','maker','spot','map','search'];
export default function App(){const [view,setView]=useState<View>('home');const [menuOpen,setMenuOpen]=useState(false);const [toast,setToast]=useState('');const [s,setS]=useState<AppState>({saved:false,booked:false,passOwned:false,passPlan:'1day',makerId:'casa'});const set=(p:Partial<AppState>)=>setS(x=>({...x,...p}));const notice=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),3400)};const go=(v:View)=>{setView(v);try{history.replaceState(null,'','#'+v)}catch{}};useEffect(()=>{const h=window.location.hash.replace('#','') as View;if(h&&ALL_VIEWS.includes(h))setView(h)},[]);return <><main className="desktop-app"><DesktopNav view={view} go={go} onMenu={()=>setMenuOpen(true)}/><section className="desktop-screen"><DesktopReference view={view} go={go} s={s} set={set} notice={notice}/></section>{menuOpen&&<DesktopMenu go={go} close={()=>setMenuOpen(false)}/>}</main><main className="mobile-app"><Screen view={view} go={go} s={s} set={set} notice={notice}/></main>{toast&&<div className="toast">{toast}</div>}</>}
