/* Home with Lana · Studio
   Sample data. Every date is an offset in days from today, so the preview
   always reads as if it were built this morning. */

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const dOff = n => { const d = new Date(TODAY); d.setDate(d.getDate()+n); return d; };
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DOWL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const fmt = d => MON[d.getMonth()]+' '+d.getDate();
const fmtL = d => DOWL[d.getDay()]+', '+MONL[d.getMonth()]+' '+d.getDate();
const usd = n => (n<0?'-':'') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');

const STAGES = ['Discover','Design','Selections','Ordering','Install','Reveal'];

/* Palette names used on mood boards */
const SWATCH = {
  linen:   {name:'Linen',       hex:'#EDE4D6', tex:'linen'},
  oat:     {name:'Oat',         hex:'#D8C7AD', tex:'linen'},
  walnut:  {name:'Walnut',      hex:'#6E4F3A', tex:'wood'},
  oak:     {name:'White oak',   hex:'#C9B18F', tex:'wood'},
  cognac:  {name:'Cognac',      hex:'#A4693A', tex:'leather'},
  saddle:  {name:'Saddle',      hex:'#7A4E2D', tex:'leather'},
  sage:    {name:'Sage',        hex:'#7E8C73', tex:'flat'},
  moss:    {name:'Moss',        hex:'#4E5C4B', tex:'flat'},
  forest:  {name:'Forest',      hex:'#2F3A33', tex:'flat'},
  oxblood: {name:'Oxblood',     hex:'#8A2B24', tex:'flat'},
  slate:   {name:'Slate blue',  hex:'#6F8796', tex:'flat'},
  powder:  {name:'Powder blue', hex:'#A9B6BD', tex:'flat'},
  quartz:  {name:'Green quartzite', hex:'#8FA392', tex:'stone'},
  marble:  {name:'Marble',      hex:'#D9D5CC', tex:'stone'},
  brass:   {name:'Unlacquered brass', hex:'#B08A4A', tex:'metal'},
  iron:    {name:'Blackened iron', hex:'#2C2724', tex:'metal'},
  ink:     {name:'Ink',         hex:'#231C18', tex:'flat'},
  navy:    {name:'Navy',        hex:'#2E3A52', tex:'flat'},
  plaster: {name:'Plaster',     hex:'#F2ECE2', tex:'flat'}
};

/* Homes */
const HOMES = [
 {id:'vc', name:'Toledo Bend Lake House', client:'The Bergeron family', short:'the Bergerons', they:true, city:'Hemphill', stage:4, scene:'lake',
  pal:['linen','oat','walnut','sage','forest'], contract:128400, expected:90100,
  pay:[['Design deposit',.30,-247],['Furnishings payment',.40,-147],['Installation payment',.25,-3],['Reveal payment',.05,36]],
  buy:[['Arhaus','Great room sofa and two chairs',14200,19880,'Delivered'],['Visual Comfort','Lighting package, 11 fixtures',9850,13790,'Delivered'],['Loloi','Rugs, five rooms',7400,10360,'Delivered'],['Four Hands','Dining table and eight chairs',8900,12460,'Arriving'],['Local millwork','Built-in bookcases',12600,15120,'Installing'],['Install crew','Delivery and placement labor',6800,8840,'Scheduled']],
  photos:[['Great room','linen','walnut'],['Primary bath','marble','sage'],['Dining','walnut','oat'],['Porch','sage','linen'],['Bunk room','oat','slate'],['Kitchen','forest','oak'],['Entry','walnut','plaster'],['The lake','slate','powder']],
  dates:[[8,'Dining set arrives','delivery'],[14,'Bookcases finished','install'],[36,'Final reveal','reveal']],
  next:'Dining set arrives {d0}. Final walk-through penciled for {d2}.',
  note:'Your dining table and chairs arrive {d0}. I can’t wait to walk you through the finished house in {m2}.',
  sels:[['Lake room table lamps, pair',1840,'Visual Comfort'],['Primary bedding and throws',1260,'Loloi']],
  rooms:['Great room','Dining','Kitchen','Primary suite','Bunk room','Porch'],
  hours:62},
 {id:'ca', name:'The Calder Avenue Bungalow', client:'Meredith and Paul Sonnier', short:'Meredith and Paul', they:true, city:'Beaumont', stage:3, scene:'bungalow',
  pal:['plaster','oat','cognac','slate','ink'], contract:64800, expected:48200,
  pay:[['Design deposit',.30,-78],['Furnishings payment',.40,-7],['Installation payment',.25,60],['Reveal payment',.05,95]],
  buy:[['Bernhardt','Living room upholstery',8400,11760,'Ready to order'],['Currey and Co','Chandeliers, two',3100,4340,'Ready to order'],['Schumacher','Wallcovering, powder bath',1650,2310,'Ready to order'],['Town Square Flooring','Wide plank oak, 1,100 sq ft',5750,8050,'Quoted']],
  photos:[['Before: living','oat','walnut'],['Before: kitchen','plaster','oat'],['Mood board','slate','cognac'],['Paint samples','oat','plaster']],
  dates:[[12,'Flooring quote expires','note'],[60,'Install begins','install']],
  next:'Furnishings payment is out. The order releases the day it clears.',
  note:'Your living room pieces are ready to order the moment the furnishings payment comes through. We’re close.',
  rooms:['Living room','Kitchen','Powder bath','Floors'],
  hours:31},
 {id:'ob', name:'Old Orange Kitchen and Butler’s Pantry', client:'Anne Thibodeaux', short:'Anne', they:false, city:'Orange', stage:4, scene:'kitchen',
  pal:['plaster','oat','moss','oxblood','ink'], contract:47200, expected:31000,
  pay:[['Design deposit',.30,-157],['Cabinet payment',.40,-97],['Installation payment',.25,-1],['Reveal payment',.05,14]],
  buy:[['Cabinet shop','Butler’s pantry cabinetry',14800,18500,'Installed'],['Gulf Coast Stone','Quartzite tops and backsplash',8200,10660,'Installed'],['Rejuvenation','Hardware and sconces',2300,3220,'Installed'],['Install crew','Tile and finish labor',4500,5850,'Installing']],
  photos:[['Pantry wall','moss','oak'],['Quartzite','quartz','marble'],['Sconces','brass','plaster'],['Hardware','brass','moss'],['Open shelves','oak','plaster']],
  dates:[[4,'Punch list walk','install'],[14,'Reveal and photos','reveal']],
  next:'Punch list this week. Reveal and photos {d1}.',
  note:'The pantry is nearly finished. Reveal day is {d1}, and I’ll have the photographer there.',
  sels:[['Pantry runner, vintage wool',640,'Loloi']],
  rooms:['Kitchen','Butler’s pantry'],
  hours:44},
 {id:'bt', name:'Big Thicket Hunting Lodge', client:'Wade Fontenot', short:'Wade', they:false, he:true, city:'Kountze', stage:2, scene:'lodge',
  pal:['oat','saddle','walnut','moss','ink'], contract:89000, expected:61800,
  pay:[['Design deposit',.30,-52],['Furnishings payment',.40,40],['Installation payment',.25,100],['Reveal payment',.05,130]],
  buy:[['Four Hands','Leather seating, great room',11200,15680,'Quoted'],['Arteriors','Antler and iron lighting',6300,8820,'Quoted']],
  photos:[['Site walk','walnut','moss'],['Stone fireplace','marble','iron'],['Mood board','saddle','moss']],
  dates:[[12,'Selections presentation','meeting']],
  next:'Selections presentation {d0}. Approval releases the furnishings invoice.',
  note:'I’m pulling together leather, iron and antler pieces for the great room. We’ll sit down and go through them {d0}.',
  rooms:['Great room','Bunk wing','Mud room','Porch'],
  hours:18},
 {id:'pi', name:'Pine Island Bayou Retreat', client:'The Landry family', short:'the Landrys', they:true, city:'Lumberton', stage:1, scene:'retreat',
  pal:['plaster','oat','oak','sage','ink'], contract:22500, expected:9800,
  pay:[['Design retainer',.50,-31],['Design complete',.50,45]],
  buy:[],
  photos:[['Before: guest room','oat','plaster'],['Before: porch','sage','oat']],
  dates:[[15,'Floor plan and mood board due','note']],
  next:'Floor plan and mood board due to the Landrys {d0}.',
  note:'Your floor plan and mood board are on my desk. You’ll have them by {d0}.',
  sels:[['Floor plan, option B',0,'Home with Lana']],
  rooms:['Guest room','Porch','Entry'],
  hours:9},
 {id:'hf', name:'Hollis Guest Suite', client:'Karen and Jim Hollis', short:'Karen and Jim', they:true, city:'Nederland', stage:5, scene:'bedroom',
  pal:['plaster','oat','powder','slate','ink'], contract:24600, expected:17300,
  pay:[['Design deposit',.30,-149],['Furnishings payment',.45,-107],['Reveal payment',.25,-15]],
  buy:[['Bernhardt','Upholstered bed and bench',6900,9660,'Delivered'],['Loloi','Rug and bedding',2100,2940,'Delivered'],['Local painter','Walls and trim',2800,3360,'Installed'],['Window treatments','Linen drapery, two rooms',3100,4340,'Installed'],['Lola Blankets','Throws for the guest suite',380,520,'Delivered'],['Visual Comfort','Bedside lamps',1250,1750,'Delivered']],
  photos:[['Reveal: bed wall','powder','plaster'],['Reveal: reading nook','oat','cognac'],['Reveal: bath','marble','slate']],
  dates:[],
  next:'The reveal is done. The reveal payment is {late} days late. A reminder went out at 7 days.',
  note:'Your guest suite is finished. Thank you for trusting me with it.',
  rooms:['Guest bedroom','Guest bath'],
  hours:27}
];

/* Derive payment status from the offset: paid if the date is past and the
   milestone is marked paid-by-default (first N), otherwise due/late/upcoming. */
HOMES.forEach(h=>{
  h.swatches = h.pal.map(k=>SWATCH[k]);
  h.colors = h.swatches.map(s=>s.hex);
  const paidCount = {vc:2, ca:1, ob:3, bt:1, pi:1, hf:2}[h.id];
  h.pay = h.pay.map(([l,pc,off],i)=>{
    const date = dOff(off);
    let s;
    if(i < paidCount) s='paid';
    else if(off >= 0) s='up';
    else if(off > -14) s='due';
    else s='late';
    return {l, amt:Math.round(h.contract*pc), date, off, s};
  });
  h.collected = h.pay.filter(x=>x.s==='paid').reduce((a,x)=>a+x.amt,0);
  h.owed = h.pay.filter(x=>x.s==='due'||x.s==='late').reduce((a,x)=>a+x.amt,0);
  h.toCome = h.pay.filter(x=>x.s==='up').reduce((a,x)=>a+x.amt,0);
  const PAIDST = s => /^(Delivered|Installed|Installing)$/.test(s);
  h.spent = h.buy.filter(b=>PAIDST(b[4])).reduce((a,b)=>a+b[2],0);
  h.committed = h.buy.filter(b=>b[4]!=='Quoted').reduce((a,b)=>a+b[2],0);
  h.profit = h.contract - h.expected;
  h.late = Math.max(0, ...h.pay.filter(x=>x.s==='late').map(x=>-x.off));
  h.dates = h.dates.map(([off,l,k])=>({date:dOff(off), off, l, k}));
  const sub = s => s.replace(/\{d(\d)\}/g,(m,i)=>fmt(h.dates[+i].date))
                    .replace(/\{m(\d)\}/g,(m,i)=>MONL[h.dates[+i].date.getMonth()])
                    .replace(/\{late\}/g, h.late);
  h.next = sub(h.next); h.note = sub(h.note);
});

/* Twelve months ending this month */
const MONTHS12 = Array.from({length:12},(_,i)=>new Date(TODAY.getFullYear(), TODAY.getMonth()-11+i, 1));
const IN12  = [52300,38400,42100,51300,46800,55200,61400,49700,58300,63100,57600,48250];
const OUT12 = [41900,31200,34800,39900,38600,43700,47200,41300,45100,47900,44200,29410];
const PERIOD = {
  month:{in:IN12[11], out:OUT12[11], note:MONL[TODAY.getMonth()]+' so far', pays:9},
  quarter:{in:IN12.slice(9).reduce((a,b)=>a+b,0), out:OUT12.slice(9).reduce((a,b)=>a+b,0), note:'Last three months', pays:31},
  year:{in:IN12.reduce((a,b)=>a+b,0), out:OUT12.reduce((a,b)=>a+b,0), note:'Last twelve months', pays:118}
};
const SOURCES = [['Furnishings',205950,'cognac'],['Showroom sales',180000,'slate'],['Design fees',142300,'oxblood'],['Flooring',96200,'sage']];
const BILLS = [['Four Hands','Dining set, Toledo Bend',6,8900],['Visual Comfort','Lighting, Toledo Bend, final',9,4200],['Showroom rent','303 S LHS Drive',25,3800],['Install crew','Toledo Bend labor',14,6800]];
const BANK = [['Operating','Everyday account',41870],['Tax set-aside','Your share of every deposit',28940],['Client deposits','Held for orders',36210],['Showroom','Register and card sales',7420]];
/* Twelve weeks of cash on hand, past 8 and projected 4 */
const CASH12 = [93200,90400,96900,103300,101800,106100,110600,114440,118900,111400,123200,127800];

/* Showroom */
const SELL=[['Lola Blankets','Throws, assorted',38,135],['Table lamps','Ceramic and brass',11,289],['Mirrors','Arched and round',7,420],['Candles and objects','Styling pieces',64,38],['Pillows','Down insert, linen',22,95]];
const LOW=[['Lola Blankets, Oatmeal','2 left',12],['Arched brass mirror','1 left',3],['Linen pillow, Rust','0 left',8]];
const FLOOR=[['Lighting','24 pieces',9850],['Mirrors and art','18 pieces',7320],['Textiles and blankets','96 pieces',6410],['Furniture','9 pieces',14200]];
const WEEKDAY=[0,430,390,470,560,760,1530]; /* Sun..Sat average sales */
const ASKED=[['Lola Blankets in Camel','asked 6 times','not stocked'],['Wide arched mirror, 60 inch','asked 4 times','can special order'],['Boucle accent chair','asked 3 times','on the floor']];

/* Peace of Mind */
const FLAGS=[
  ['A bill came in higher than its quote','Local millwork billed $13,400 for the Toledo Bend bookcases. The quote was $12,600.','It waits here until you say the difference is fine.'],
  ['A first payment to someone new','Gulf Coast Stone, $2,150, for the Old Orange quartzite.','First payments to anyone new wait for your OK.']
];
const MOVES=[...(dOff(-1).getDay()? [['In','Showroom card sales','Register, '+DOWL[dOff(-1).getDay()],1840]] : []),['In','Anne Thibodeaux','Old Orange, installation payment',11800],['Out','Local millwork','Toledo Bend bookcases, progress payment',2150],['Out','Lola Blankets','Showroom reorder',1140],['Out','Payroll','Every two weeks, three people',6880],['Out','Entergy','Showroom electric',412]];
const RULES=[['Payments over $1,000 need your OK',true],['First payments to anyone new need your OK',true],['Refunds need your OK',true],['A text every morning at 7 with yesterday’s money',true],['Checks need a second signature',true],['A quiet word each morning',true,'word'],['Keep Sundays quiet',true,'sunday']];
const TEAM=[['L','Lana','Owner. Sees everything. Gives the OK.','oxblood'],['H','Hershel','Owner. Sees everything.','cognac'],['O','The office','Enters bills and invoices. Does not send money.','sage'],['B','Bookkeeper','Sees everything. Changes nothing.','slate'],['C','Your CPA','Reads the books. Changes nothing.','ink']];
const NIGHTLY = [1,1,1,1,1,1,1]; /* last seven nights all checked */

/* Connections */
const CONNS = [
 ['B','Books','sage','Connected', ['QuickBooks Online'], ['Xero'],
   ['Every invoice, payment and bill, matched to the right home','Taxes set aside the moment money lands','Your OK before a bill is paid or money goes out'],
   ['Typing numbers into a spreadsheet','Guessing what you made on a home']],
 ['D','Design and selections','oxblood','Works with yours', ['Houzz Pro','Programa','Studio Designer','Design Manager'], [],
   ['Proposals, selections and purchase orders for every home','What each item cost you and what the client pays','Invoices push straight into the books'],
   ['Rebuilding a budget by hand','Losing track of what was ordered']],
 ['P','Job photos','cognac','Connected', ['CompanyCam'], [],
   ['Photos from the site, filed to the right home on their own','A new client in the books starts a new photo album','Before and after, ready for your Instagram'],
   ['Hunting through a camera roll','Texting photos one at a time']],
 ['S','Showroom register','slate','Ready to connect', ['Square for Retail','Shopify POS'], [],
   ['Every sale at 303 S LHS, item by item','Stock counts that drop as things sell','Daily sales posted to the books'],
   ['Counting the drawer to know how the week went','Finding out a best seller sold out last week']],
 ['$','Client payments','saddle','Connected', ['QuickBooks Payments','Stripe'], [],
   ['A Pay button on every invoice, card or bank transfer','Gentle reminders that send themselves','Paid invoices close out on their own'],
   ['Chasing checks','Awkward phone calls about money']],
 ['T','Payroll','walnut','Ready to connect', ['Gusto','QuickBooks Payroll'], [],
   ['Paychecks and payroll taxes on schedule','Labor cost on each home','One clear record of who was paid what'],
   ['Writing payroll checks','Missing a tax deadline']],
 ['K','Bank and cards','ink','Connected', ['Any bank, through your books'], [],
   ['What came in and went out, every morning','A note when something looks unusual','Each account in plain view'],
   ['Logging in to three banks to see where you stand']]
];
const RECIPES = [
 ['When a client pays an invoice',['The payment lands in your books, matched to their home','Your share is set aside for taxes','The home’s progress updates','It shows on tomorrow’s 7 AM text']],
 ['When a client approves a selection',['A purchase order is drafted for that vendor','The deposit invoice goes to the client','The item shows on the home as Ordered once you give the OK']],
 ['When an invoice is 7 days late',['A gentle reminder goes out in your voice','At 14 days it lands in Needs You Today','You decide if it needs a call']],
 ['When anyone adds a vendor or a refund',['It is held, not paid','It waits in Peace of Mind for your yes','Nothing moves until you clear it']],
 ['When the crew snaps photos on site',['They file to the right home','The client sees the best ones on their page','You can share them to Instagram in one tap']],
 ['Every night',['The books, bank, register and photos all check in','Each dollar is matched to a home or a bill','Your morning summary is written and ready']]
];

/* A quiet word for the morning. Rotates by day of year. */
const WORDS = [
 ['Unless the <span class="sc">Lord</span> builds the house, the builders labor in vain.','Psalm 127:1'],
 ['Commit to the <span class="sc">Lord</span> whatever you do, and he will establish your plans.','Proverbs 16:3'],
 ['She is clothed with strength and dignity; she can laugh at the days to come.','Proverbs 31:25'],
 ['By wisdom a house is built, and through understanding it is established.','Proverbs 24:3'],
 ['Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.','Colossians 3:23'],
 ['Be still, and know that I am God.','Psalm 46:10'],
 ['My people will live in peaceful dwelling places, in secure homes, in undisturbed places of rest.','Isaiah 32:18']
];
