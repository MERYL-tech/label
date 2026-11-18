// ============================================================================
// การตั้งค่า AI for Thai API Key (OCR + Image Tagging)
// ============================================================================
const AI_FOR_THAI_API_KEY = "XttDXVy5Om1SG2nHheN9xLcsYMsRhXG6";
const AI_FOR_THAI_OCR_ENDPOINT = "https://api.aiforthai.in.th/ocr";
const AI_FOR_THAI_TAG_ENDPOINT = "https://api.aiforthai.in.th/tagsuggestion";

// ============================================================================
// ฐานข้อมูลป้ายหลัก (เน้นป้ายสารเคมี UN/ADR 16 ชนิดครบทุก Class 1-9 + ป้ายจราจร/เตือน)
// ระดับความอันตราย (severity): 4 = วิกฤตถึงชีวิต, 3 = อันตรายสูง, 2 = เฝ้าระวัง, 1 = ข้อบังคับทั่วไป
// ============================================================================
const DEFAULT_SIGN_DATABASE = [
    // --- หมวดหลัก: ป้ายสารเคมีวัตถุอันตราย (HAZMAT Class 1 - Class 9) ---
    {
        id: "un_1203",
        category: "hazmat",
        hazmatClass: "Class 3",
        unCode: "1203",
        shortName: "UN 1203 เบนซิน",
        type: "ป้ายสารเคมี Class 3 (ของเหลวไวไฟ)",
        level: "danger",
        severity: 3,
        keywords: ["1203", "GASOLINE", "PETROL", "เบนซิน", "ไวไฟ"],
        ocrSample: "UN 1203 | FLAMMABLE LIQUID 3 (รหัสอันตราย 33)",
        title: "วัตถุไวไฟสูง: น้ำมันเบนซิน (UN 1203)",
        desc: "ของเหลวไวไฟสูงมาก จุดวาบไฟต่ำ (-40°C) ไอระเหยหนักกว่าอากาศ ลอยไปตามพื้นและลุกติดไฟได้ทันทีเมื่อเจอประกายไฟ",
        action: "ดับเครื่องยนต์ทันที ห้ามสูบบุหรี่ ห้ามใช้โทรศัพท์หรือเปิดสวิตช์ไฟใกล้จุดรั่วไหล อพยพไปอยู่เหนือลม",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 เมตร (หากเกิดเพลิงไหม้รถถัง ให้ถอยห่าง 800 เมตร)",
        regulation: "ชุดป้องกันสารเคมี + เครื่องช่วยหายใจ (SCBA) | อ้างอิง: UN/ADR Class 3, ERG Guide 128"
    },
    {
        id: "un_1075",
        category: "hazmat",
        hazmatClass: "Class 2.1",
        unCode: "1075",
        shortName: "UN 1075 ก๊าซ LPG",
        type: "ป้ายสารเคมี Class 2.1 (ก๊าซไวไฟ)",
        level: "critical",
        severity: 4,
        keywords: ["1075", "LPG", "PROPANE", "BUTANE", "ก๊าซหุงต้ม", "ก๊าซไวไฟ"],
        ocrSample: "UN 1075 | FLAMMABLE GAS 2.1 (รหัสอันตราย 23)",
        title: "ก๊าซไวไฟแรงดันสูง: ก๊าซปิโตรเลียมเหลว LPG (UN 1075)",
        desc: "ก๊าซไวไฟบรรจุภายใต้ความดัน เสี่ยงต่อการระเบิดรุนแรง (BLEVE) เมื่อได้รับความร้อน ไอระเหยอาจทำให้ขาดออกซิเจน",
        action: "ห้ามก่อประกายไฟทุกชนิด หลีกเลี่ยงพื้นที่ต่ำหรือท่อระบายน้ำ ฉีดละอองน้ำหล่อเย็นถังจากระยะไกล",
        distance: "กั้นเขตอันตรายอย่างน้อย 100 เมตร (หากไฟไหม้ถังก๊าซขนาดใหญ่ อพยพห่าง 1,600 เมตร)",
        regulation: "เครื่องวัดก๊าซติดไฟ (LEL Meter) + ชุดผจญเพลิง | อ้างอิง: UN/ADR Class 2.1, ERG Guide 115"
    },
    {
        id: "un_1789",
        category: "hazmat",
        hazmatClass: "Class 8",
        unCode: "1789",
        shortName: "UN 1789 กรดเกลือ",
        type: "ป้ายสารเคมี Class 8 (สารกัดกร่อน)",
        level: "danger",
        severity: 3,
        keywords: ["1789", "HYDROCHLORIC", "MURIATIC", "กรดเกลือ", "กรดไฮโดรคลอริก"],
        ocrSample: "UN 1789 | CORROSIVE 8 (รหัสอันตราย 80)",
        title: "สารกัดกร่อน: กรดไฮโดรคลอริก / กรดเกลือ (UN 1789)",
        desc: "สารละลายกรดเข้มข้น กัดกร่อนเนื้อเยื่อผิวหนัง ดวงตา ระบบทางเดินหายใจ และกัดกร่อนโลหะเกิดก๊าซไฮโดรเจนไวไฟ",
        action: "ห้ามสัมผัสสารโดยตรง หากถูกผิวหนังหรือเข้าตาให้ล้างด้วยน้ำสะอาดปริมาณมากต่อเนื่องอย่างน้อย 15 - 20 นาที",
        distance: "อยู่เหนือลมและห่างจากจุดรั่วไหลอย่างน้อย 30 - 50 เมตร",
        regulation: "ถุงมือยางนีโอพรีน, แว่นครอบตา (Goggles), หน้ากากกรองไอสารเคมี | อ้างอิง: ADR Class 8, ERG Guide 157"
    },
    {
        id: "un_1830",
        category: "hazmat",
        hazmatClass: "Class 8",
        unCode: "1830",
        shortName: "UN 1830 กรดกำมะถัน",
        type: "ป้ายสารเคมี Class 8 (สารกัดกร่อนรุนแรง)",
        level: "critical",
        severity: 4,
        keywords: ["1830", "SULFURIC", "กรดซัลฟิวริก", "กรดกำมะถัน"],
        ocrSample: "UN 1830 | CORROSIVE 8 (รหัสอันตราย 80)",
        title: "สารกัดกร่อนรุนแรง: กรดซัลฟิวริก / กรดกำมะถัน (UN 1830)",
        desc: "กรดแก่ที่มีฤทธิ์ทำลายเนื้อเยื่อรุนแรงมาก ทำปฏิกิริยาคายความร้อนรุนแรงและเดือดกระเด็นเมื่อสัมผัสน้ำ",
        action: "ห้ามฉีดน้ำลงไปในกรดเข้มข้นโดยตรง ใช้ทรายแห้งหรือดินกลบซับสารที่รั่วไหล อพยพผู้คนออกเหนือลม",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 - 100 เมตรเหนือลม",
        regulation: "ชุดป้องกันสารเคมีเต็มตัว (Chemical Suit) + SCBA | อ้างอิง: UN/ADR Class 8, ERG Guide 137"
    },
    {
        id: "un_1824",
        category: "hazmat",
        hazmatClass: "Class 8",
        unCode: "1824",
        shortName: "UN 1824 โซดาไฟ",
        type: "ป้ายสารเคมี Class 8 (ด่างกัดกร่อน)",
        level: "danger",
        severity: 3,
        keywords: ["1824", "SODIUM HYDROXIDE", "CAUSTIC", "โซดาไฟ", "โซเดียมไฮดรอกไซด์"],
        ocrSample: "UN 1824 | CORROSIVE 8 (รหัสอันตราย 80)",
        title: "ด่างกัดกร่อน: สารละลายโซเดียมไฮดรอกไซด์ / โซดาไฟ (UN 1824)",
        desc: "สารละลายด่างเข้มข้น กัดกร่อนผิวหนังและทำให้ตาบอดถาวรได้ทันทีเมื่อกระเด็นเข้าตา",
        action: "ห้ามสัมผัสโดยตรง หากเปื้อนผิวหนังให้ล้างออกด้วยน้ำสะอาดจำนวนมากทันที 15 นาที และพบแพทย์",
        distance: "รักษาระยะห่างจากจุดรั่วไหลอย่างน้อย 30 - 50 เมตร",
        regulation: "กระบังป้องกันใบหน้า (Face Shield) + ถุงมือยางทนสารเคมี | อ้างอิง: ADR Class 8, ERG Guide 154"
    },
    {
        id: "un_1017",
        category: "hazmat",
        hazmatClass: "Class 2.3",
        unCode: "1017",
        shortName: "UN 1017 ก๊าซคลอรีน",
        type: "ป้ายสารเคมี Class 2.3 (ก๊าซพิษร้ายแรง)",
        level: "critical",
        severity: 4,
        keywords: ["1017", "CHLORINE", "คลอรีน", "ก๊าซพิษ"],
        ocrSample: "UN 1017 | TOXIC GAS 2.3 / 5.1 / 8",
        title: "ก๊าซพิษร้ายแรงถึงชีวิต: ก๊าซคลอรีน (UN 1017)",
        desc: "ก๊าซพิษสีเขียวอมเหลืองกลิ่นฉุนจัด หนักกว่าอากาศ ลอยต่ำตามพื้นดิน ทำลายระบบทางเดินหายใจและปอดอย่างเฉียบพลัน",
        action: "อพยพขึ้นที่สูงและอยู่เหนือลมทันที ปิดปากและจมูกด้วยผ้าชุบน้ำขณะหนี ห้ามใช้น้ำฉีดใส่จุดรั่วของคลอรีน",
        distance: "กั้นเขตอันตรายอย่างน้อย 150 - 300 เมตรเหนือลม (รั่วขนาดใหญ่ห่าง 800 เมตร)",
        regulation: "ชุดป้องกันก๊าซพิษระดับ A (Level A Suit) + SCBA | อ้างอิง: ADR Class 2.3, ERG Guide 124"
    },
    {
        id: "un_1005",
        category: "hazmat",
        hazmatClass: "Class 2.3",
        unCode: "1005",
        shortName: "UN 1005 แอมโมเนีย",
        type: "ป้ายสารเคมี Class 2.3 (ก๊าซพิษและกัดกร่อน)",
        level: "critical",
        severity: 4,
        keywords: ["1005", "AMMONIA", "แอมโมเนีย"],
        ocrSample: "UN 1005 | TOXIC GAS 2.3 / 8",
        title: "ก๊าซพิษกัดกร่อน: ก๊าซแอมโมเนีย (UN 1005)",
        desc: "ก๊าซไม่มีสีกลิ่นฉุนแสบจมูกอย่างรุนแรง ทำลายเยื่อบุตาและปอด หากความเข้มข้นสูงในที่อับอากาศสามารถระเบิดได้",
        action: "อพยพไปอยู่เหนือลมทันที ห้ามสูดดม ใช้ละอองน้ำฉีดม่านน้ำเพื่อดักจับไอแอมโมเนียในอากาศ",
        distance: "กั้นเขตอันตรายอย่างน้อย 100 - 200 เมตรเหนือลม",
        regulation: "หน้ากากกรองก๊าซแอมโมเนีย (ตลับกรองสีเขียว) หรือ SCBA | อ้างอิง: ADR Class 2.3, ERG Guide 125"
    },
    {
        id: "un_1689",
        category: "hazmat",
        hazmatClass: "Class 6.1",
        unCode: "1689",
        shortName: "UN 1689 ไซยาไนด์",
        type: "ป้ายสารเคมี Class 6.1 (สารพิษร้ายแรง)",
        level: "critical",
        severity: 4,
        keywords: ["1689", "CYANIDE", "SODIUM CYANIDE", "ไซยาไนด์", "สารพิษ"],
        ocrSample: "UN 1689 | TOXIC 6.1 (รหัสอันตราย 66)",
        title: "สารพิษร้ายแรงถึงชีวิต: โซเดียมไซยาไนด์ (UN 1689)",
        desc: "สารพิษเฉียบพลันรุนแรงมาก เป็นอันตรายถึงชีวิตเมื่อกลืนกิน สูดดม หรือดูดซึมผ่านผิวหนัง หากโดนกรดจะเกิดก๊าซพิษไฮโดรเจนไซยาไนด์",
        action: "ห้ามสัมผัสหรือเข้าใกล้โดยเด็ดขาด ห้ามให้สารสัมผัสกับน้ำหรือกรด รีบแจ้งหน่วยกู้ภัยสารเคมีเฉพาะทาง",
        distance: "กั้นเขตอันตรายอย่างน้อย 100 เมตรในทุกทิศทาง",
        regulation: "ชุดป้องกันสารเคมีระดับ A + SCBA | อ้างอิง: UN/ADR Class 6.1, ERG Guide 157"
    },
    {
        id: "un_1202",
        category: "hazmat",
        hazmatClass: "Class 3",
        unCode: "1202",
        shortName: "UN 1202 น้ำมันดีเซล",
        type: "ป้ายสารเคมี Class 3 (ของเหลวไวไฟ)",
        level: "danger",
        severity: 3,
        keywords: ["1202", "DIESEL", "GAS OIL", "ดีเซล", "น้ำมันเตา"],
        ocrSample: "UN 1202 | FLAMMABLE LIQUID 3 (รหัสอันตราย 30)",
        title: "ของเหลวไวไฟ: น้ำมันดีเซล / น้ำมันเตา (UN 1202)",
        desc: "ของเหลวติดไฟได้ เมื่อได้รับความร้อนสูงจะเกิดไอระเหยติดไฟและลื่นไหลปนเปื้อนแหล่งน้ำได้ง่าย",
        action: "ดับเครื่องยนต์ งดสูบบุหรี่ ใช้วัสดุดูดซับหรือคันดินกั้นไม่ให้ไหลลงท่อระบายน้ำสาธารณะ",
        distance: "กั้นเขตปลอดภัยอย่างน้อย 50 เมตรรอบจุดรั่วไหล",
        regulation: "ถุงมือทนน้ำมัน + แว่นตานิรภัย | อ้างอิง: UN/ADR Class 3, ERG Guide 128"
    },
    {
        id: "un_1170",
        category: "hazmat",
        hazmatClass: "Class 3",
        unCode: "1170",
        shortName: "UN 1170 เอทานอล",
        type: "ป้ายสารเคมี Class 3 (ของเหลวไวไฟ)",
        level: "danger",
        severity: 3,
        keywords: ["1170", "ETHANOL", "ALCOHOL", "เอทานอล", "แอลกอฮอล์"],
        ocrSample: "UN 1170 | FLAMMABLE LIQUID 3 (รหัสอันตราย 33)",
        title: "ของเหลวไวไฟ: เอทานอล / เอทิลแอลกอฮอล์ (UN 1170)",
        desc: "ของเหลวไวไฟสูง เปลวไฟของเอทานอลมองเห็นได้ยากในเวลากลางวัน (เปลวไฟสีฟ้าจาง)",
        action: "ห้ามก่อประกายไฟ ระบายอากาศในพื้นที่ ใช้โฟมทนแอลกอฮอล์ (AR-AFFF) หรือผงเคมีแห้งในการดับเพลิง",
        distance: "กั้นเขตปลอดภัยอย่างน้อย 50 เมตรรอบจุดเกิดเหตุ",
        regulation: "แว่นครอบตา + ถุงมือไนไตรล์ | อ้างอิง: UN/ADR Class 3, ERG Guide 127"
    },
    {
        id: "un_1428",
        category: "hazmat",
        hazmatClass: "Class 4.3",
        unCode: "1428",
        shortName: "UN 1428 โซเดียม",
        type: "ป้ายสารเคมี Class 4.3 (อันตรายเมื่อเปียกน้ำ)",
        level: "critical",
        severity: 4,
        keywords: ["1428", "SODIUM", "DANGEROUS WHEN WET", "โซเดียม", "ห้ามโดนน้ำ"],
        ocrSample: "UN 1428 | DANGEROUS WHEN WET 4.3 (รหัส X423)",
        title: "วัตถุอันตรายเมื่อเปียกน้ำ: โลหะโซเดียม (UN 1428)",
        desc: "ทำปฏิกิริยารุนแรงและระเบิดติดไฟทันทีเมื่อสัมผัสน้ำหรือความชื้น ปลดปล่อยก๊าซไฮโดรเจนที่ไวไฟสูงมาก",
        action: "ห้ามใช้น้ำหรือโฟมดับไฟโดยเด็ดขาด! ใช้ผงเคมีแห้งชนิดพิเศษ (Class D) หรือทรายแห้งสนิทกลบ",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 - 100 เมตร ห้ามนำน้ำเข้าใกล้พื้นที่",
        regulation: "ชุดทนความร้อน + ถังดับเพลิง Class D | อ้างอิง: UN/ADR Class 4.3, ERG Guide 138"
    },
    {
        id: "un_1350",
        category: "hazmat",
        hazmatClass: "Class 4.1",
        unCode: "1350",
        shortName: "UN 1350 กำมะถัน",
        type: "ป้ายสารเคมี Class 4.1 (ของแข็งไวไฟ)",
        level: "warning",
        severity: 2,
        keywords: ["1350", "SULFUR", "SULPHUR", "กำมะถัน", "ของแข็งไวไฟ"],
        ocrSample: "UN 1350 | FLAMMABLE SOLID 4.1 (รหัสอันตราย 40)",
        title: "ของแข็งไวไฟ: กำมะถัน (UN 1350)",
        desc: "ผงหรือก้อนกำมะถันติดไฟได้ง่ายจากประกายไฟหรือความร้อน เมื่อลุกไหม้จะเกิดก๊าซซัลเฟอร์ไดออกไซด์ที่เป็นพิษ",
        action: "หลีกเลี่ยงการฟุ้งกระจายของฝุ่นกำมะถัน งดประกายไฟ ฉีดละอองน้ำฝอยเพื่อควบคุมฝุ่นและดับไฟ",
        distance: "รักษาระยะห่างอย่างน้อย 25 - 50 เมตรเหนือลม",
        regulation: "หน้ากากป้องกันฝุ่นและก๊าซกรด + แว่นตานิรภัย | อ้างอิง: UN/ADR Class 4.1, ERG Guide 133"
    },
    {
        id: "un_2014",
        category: "hazmat",
        hazmatClass: "Class 5.1",
        unCode: "2014",
        shortName: "UN 2014 เปอร์ออกไซด์",
        type: "ป้ายสารเคมี Class 5.1 (สารออกซิไดซ์)",
        level: "danger",
        severity: 3,
        keywords: ["2014", "HYDROGEN PEROXIDE", "OXIDIZER", "เปอร์ออกไซด์", "ออกซิไดซ์"],
        ocrSample: "UN 2014 | OXIDIZER 5.1 / 8 (รหัสอันตราย 58)",
        title: "สารออกซิไดซ์รุนแรง: ไฮโดรเจนเปอร์ออกไซด์เข้มข้น (UN 2014)",
        desc: "ให้ออกซิเจนสูง เร่งการลุกไหม้ของเชื้อเพลิงอย่างรุนแรง และกัดกร่อนผิวหนัง/ดวงตาอย่างหนัก",
        action: "แยกให้ห่างจากสารไวไฟ ไม้ กระดาษ และน้ำมัน ใช้น้ำปริมาณมากฉีดเจือจางและลดความร้อน",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 เมตรรอบจุดรั่วไหล",
        regulation: "ชุดป้องกันสารเคมี + แว่นครอบตา | อ้างอิง: UN/ADR Class 5.1, ERG Guide 140"
    },
    {
        id: "un_0336",
        category: "hazmat",
        hazmatClass: "Class 1.4",
        unCode: "0336",
        shortName: "UN 0336 วัตถุระเบิด/พลุ",
        type: "ป้ายสารเคมี Class 1 (วัตถุระเบิด)",
        level: "critical",
        severity: 4,
        keywords: ["0336", "EXPLOSIVE", "FIREWORKS", "วัตถุระเบิด", "ดอกไม้ไฟ", "พลุ"],
        ocrSample: "UN 0336 | EXPLOSIVE 1.4G",
        title: "วัตถุระเบิดและดอกไม้ไฟ: (UN 0336)",
        desc: "มีความเสี่ยงต่อการระเบิดและเกิดสะเก็ดไฟพุ่งกระจายเมื่อได้รับแรงกระแทก การเสียดสี หรือความร้อน",
        action: "ห้ามเข้าใกล้ ห้ามเคลื่อนย้ายวัตถุต้องสงสัย ดับเครื่องยนต์และงดใช้วิทยุสื่อสาร/โทรศัพท์ใกล้จุดเกิดเหตุ",
        distance: "อพยพผู้คนออกห่างอย่างน้อย 100 - 300 เมตร (หากเกิดเพลิงไหม้ถอยห่าง 800 เมตร)",
        regulation: "หน่วยเก็บกู้วัตถุระเบิด (EOD) | อ้างอิง: UN/ADR Class 1, ERG Guide 114"
    },
    {
        id: "un_2915",
        category: "hazmat",
        hazmatClass: "Class 7",
        unCode: "2915",
        shortName: "UN 2915 กัมมันตรังสี",
        type: "ป้ายสารเคมี Class 7 (วัสดุกัมมันตรังสี)",
        level: "critical",
        severity: 4,
        keywords: ["2915", "RADIOACTIVE", "RADIATION", "กัมมันตรังสี", "รังสี"],
        ocrSample: "UN 2915 | RADIOACTIVE 7",
        title: "วัสดุกัมมันตรังสี: (UN 2915)",
        desc: "แผ่รังสีไอออไนซ์ที่เป็นอันตรายต่อเซลล์ร่างกายและพันธุกรรม ไม่สามารถมองเห็นหรือได้กลิ่น",
        action: "ห้ามเข้าใกล้หรือสัมผัสหีบห่อที่ชำรุด ใช้หลักการ เวลา-ระยะทาง-เครื่องกำบัง และแจ้งสำนักงานปรมาณูเพื่อสันติ",
        distance: "กั้นเขตควบคุมรังสีอย่างน้อย 50 - 100 เมตร หรือตามค่าเครื่องวัดรังสี",
        regulation: "เครื่องวัดรังสี (Dosimeter / Survey Meter) | อ้างอิง: UN/ADR Class 7, ERG Guide 163"
    },
    {
        id: "un_3082",
        category: "hazmat",
        hazmatClass: "Class 9",
        unCode: "3082",
        shortName: "UN 3082 พิษต่อสิ่งแวดล้อม",
        type: "ป้ายสารเคมี Class 9 (อันตรายเบ็ดเตล็ด/สิ่งแวดล้อม)",
        level: "warning",
        severity: 2,
        keywords: ["3082", "ENVIRONMENTALLY HAZARDOUS", "CLASS 9", "สิ่งแวดล้อม", "มลพิษ"],
        ocrSample: "UN 3082 | MISCELLANEOUS 9 (รหัสอันตราย 90)",
        title: "สารอันตรายต่อสิ่งแวดล้อมในน้ำ: (UN 3082)",
        desc: "เป็นพิษต่อสิ่งมีชีวิตในน้ำและระบบนิเวศระยะยาว หากรั่วไหลลงแหล่งน้ำจะสร้างความเสียหายรุนแรง",
        action: "ปิดกั้นท่อระบายน้ำและทางน้ำธรรมชาติ ใช้ทุ่นกักซับหรือวัสดุดูดซับเก็บกู้สารเคมีทั้งหมด",
        distance: "กั้นเขตปฏิบัติงานเก็บกู้สารเคมีอย่างน้อย 25 เมตร",
        regulation: "ถุงมือยาง + รองเท้าบูทกันสารเคมี | อ้างอิง: UN/ADR Class 9, ERG Guide 171"
    },

    // --- หมวดป้ายจราจร (Traffic Signs) ---
    {
        id: "traffic_stop",
        category: "traffic",
        hazmatClass: "ป้ายบังคับ",
        shortName: "ป้ายหยุด (STOP)",
        type: "ป้ายจราจร (ป้ายบังคับ)",
        level: "danger",
        severity: 3,
        keywords: ["STOP", "หยุด"],
        ocrSample: "หยุด / STOP",
        title: "ป้ายหยุด (STOP)",
        desc: "ผู้ขับขี่ต้องหยุดรถให้สนิทก่อนถึงแนวเส้นหยุดบริเวณทางแยกหรือจุดตัดทางรถไฟ",
        action: "เหยียบเบรกให้รถหยุดนิ่งสนิท มองซ้าย-ขวาตรวจสอบกระแสจราจร เมื่อปลอดภัยจึงออกรถได้",
        distance: "หยุดก่อนถึงเส้นหยุดขาวทึบ 1 - 2 เมตร ห้ามล้ำเข้าทางร่วมทางแยก",
        regulation: "พ.ร.บ. จราจรทางบก พ.ศ. 2522 (ป้ายบังคับ ฝ่าฝืนมีโทษปรับตามกฎหมาย)"
    },
    {
        id: "traffic_no_overtaking",
        category: "traffic",
        hazmatClass: "ป้ายบังคับ",
        shortName: "ป้ายห้ามแซง",
        type: "ป้ายจราจร (ป้ายบังคับ)",
        level: "danger",
        severity: 3,
        keywords: ["ห้ามแซง", "NO OVERTAKING"],
        ocrSample: "SYMBOL: NO_OVERTAKING_ZONE",
        title: "ป้ายห้ามแซง (No Overtaking)",
        desc: "ห้ามขับรถแซงขึ้นหน้ารถคันอื่นในเขตทางคับขัน ทางโค้ง ขึ้นเนิน หรือจุดอับสายตา",
        action: "ขับรถตามหลังคันหน้าในช่องทางของตน รักษาระยะห่างและใช้ความเร็วที่เหมาะสม",
        distance: "ตลอดแนวเส้นทึบสีเหลือง/ขาว จนกว่าจะพ้นเขตป้ายสิ้นสุดการห้ามแซง",
        regulation: "พ.ร.บ. จราจรทางบก มาตรา 46"
    },
    {
        id: "traffic_speed_60",
        category: "traffic",
        hazmatClass: "จำกัดความเร็ว",
        shortName: "จำกัดความเร็ว 60",
        type: "ป้ายจราจร (ป้ายบังคับจำกัดความเร็ว)",
        level: "warning",
        severity: 2,
        keywords: ["60", "SPEED LIMIT"],
        ocrSample: "60 km/h",
        title: "ป้ายจำกัดความเร็วไม่เกิน 60 กม./ชม.",
        desc: "กำหนดอัตราความเร็วสูงสุดไม่เกิน 60 กิโลเมตรต่อชั่วโมง เพื่อความปลอดภัยในเขตชุมชนหรือเขตก่อสร้าง",
        action: "ถอนคันเร่งและชะลอความเร็วให้อยู่ในเกณฑ์ที่กำหนด สังเกตรถเข้า-ออกซอยและคนเดินเท้า",
        distance: "บังคับใช้ตั้งแต่จุดที่ติดตั้งป้ายไปจนถึงป้ายกำหนดความเร็วถัดไป",
        regulation: "กฎกระทรวงกำหนดอัตราความเร็วของยานพาหนะ"
    },
    {
        id: "traffic_curve",
        category: "traffic",
        hazmatClass: "ป้ายเตือน",
        shortName: "ทางโค้งอันตราย",
        type: "ป้ายจราจร (ป้ายเตือน)",
        level: "warning",
        severity: 2,
        keywords: ["ทางโค้ง", "CURVE"],
        ocrSample: "SYMBOL: SHARP_CURVE_AHEAD",
        title: "ป้ายเตือนทางโค้งอันตรายข้างหน้า",
        desc: "แจ้งเตือนว่าข้างหน้ามีทางโค้งรัศมีแคบหรือโค้งหักศอก อาจเกิดการเสียหลักหลุดโค้งได้ง่าย",
        action: "ชะลอความเร็วก่อนเข้าโค้ง ไม่เหยียบเบรกกะทันหันกลางโค้ง และไม่ขับคร่อมเลน",
        distance: "ติดตั้งล่วงหน้าก่อนถึงจุดเริ่มโค้งประมาณ 100 - 250 เมตร",
        regulation: "มาตรฐานป้ายเตือนกรมทางหลวง"
    },

    // --- หมวดป้ายเตือนความปลอดภัยและโรงงาน (Safety Signs) ---
    {
        id: "safety_high_voltage",
        category: "safety",
        hazmatClass: "ISO W012",
        shortName: "ระวังไฟฟ้าแรงสูง",
        type: "ป้ายเตือนความปลอดภัย (อันตรายทางไฟฟ้า)",
        level: "danger",
        severity: 3,
        keywords: ["ไฟฟ้า", "HIGH VOLTAGE", "VOLT"],
        ocrSample: "อันตราย ไฟฟ้าแรงสูง / HIGH VOLTAGE",
        title: "ป้ายเตือนระวังอันตรายจากไฟฟ้าแรงสูง",
        desc: "พื้นที่ติดตั้งอุปกรณ์ไฟฟ้าแรงดันสูง เสี่ยงต่อการเกิดไฟฟ้าดูดและอาร์กแฟลชถึงแก่ชีวิต",
        action: "ห้ามเข้าใกล้ ห้ามเปิดตู้ควบคุม และห้ามนำวัตถุโลหะเข้าใกล้แนวสายไฟโดยเด็ดขาด",
        distance: "รักษาระยะห่างความปลอดภัยทางไฟฟ้าอย่างน้อย 3 เมตรขึ้นไปตามระดับแรงดัน",
        regulation: "ถุงมือกันไฟฟ้า, รองเท้าเซฟตี้กันไฟฟ้า | อ้างอิง: ISO 7010 W012"
    },
    {
        id: "safety_wet_floor",
        category: "safety",
        hazmatClass: "ISO W011",
        shortName: "ระวังพื้นลื่น",
        type: "ป้ายเตือนความปลอดภัย (พื้นที่ปฏิบัติงาน)",
        level: "warning",
        severity: 2,
        keywords: ["พื้นลื่น", "WET FLOOR", "CAUTION"],
        ocrSample: "ระวังพื้นลื่น / CAUTION WET FLOOR",
        title: "ป้ายเตือนระวังพื้นลื่น (Wet Floor)",
        desc: "พื้นผิวเปียกน้ำ มีคราบน้ำมัน หรืออยู่ระหว่างการทำความสะอาด อาจทำให้ลื่นล้มบาดเจ็บได้",
        action: "เดินด้วยความระมัดระวัง ก้าวสั้นๆ ไม่วิ่งหรือเดินล้วงกระเป๋า และหลีกเลี่ยงบริเวณที่กั้นเขต",
        distance: "ครอบคลุมบริเวณพื้นเปียกรอบป้ายตั้งเตือนจนกว่าพื้นจะแห้งสนิท",
        regulation: "รองเท้าพื้นกันลื่น | อ้างอิง: ISO 7010 W011"
    },
    {
        id: "safety_ppe_helmet",
        category: "safety",
        hazmatClass: "ISO M014",
        shortName: "สวมหมวกนิรภัย",
        type: "ป้ายบังคับความปลอดภัย (PPE)",
        level: "info",
        severity: 1,
        keywords: ["หมวกนิรภัย", "HELMET", "PPE"],
        ocrSample: "กรุณาสวมหมวกนิรภัย / WEAR SAFETY HELMET",
        title: "ป้ายบังคับ: ต้องสวมหมวกนิรภัยตลอดเวลา",
        desc: "พื้นที่ก่อสร้าง คลังสินค้า หรือพื้นที่ปฏิบัติงานที่มีความเสี่ยงจากวัตถุตกหล่นหรือการกระแทกศีรษะ",
        action: "สวมหมวกนิรภัยพร้อมรัดสายรัดคางให้กระชับก่อนเดินผ่านจุดติดตั้งป้ายทุกครั้ง",
        distance: "บังคับใช้ตลอดระยะเวลาที่อยู่ในเขตพื้นที่ปฏิบัติงาน",
        regulation: "หมวกนิรภัยมาตรฐาน มอก. 368 | อ้างอิง: ISO 7010 M014"
    }
];

// ============================================================================
// ฐานข้อมูลรหัส UN Number เสริม (สำหรับการค้นหารหัส 4 หลักเพิ่มเติม)
// ============================================================================
const EXTRA_UN_LOOKUP_DB = [
    {
        unCode: "1993",
        shortName: "UN 1993 ของเหลวไวไฟ",
        hazmatClass: "Class 3",
        level: "danger",
        severity: 3,
        type: "ป้ายสารเคมี Class 3 (ของเหลวไวไฟไม่ระบุชื่อเฉพาะ)",
        title: "ของเหลวไวไฟไม่ระบุชื่อเฉพาะ (UN 1993)",
        desc: "สารละลายไวไฟหรือน้ำมันเชื้อเพลิงผสม ไอระเหยติดไฟได้ง่ายเมื่อสัมผัสประกายไฟหรือความร้อนสูง",
        action: "ดับเครื่องยนต์ งดก่อประกายไฟทุกชนิด อพยพผู้คนไปอยู่เหนือลม",
        distance: "กั้นเขตปลอดภัยอย่างน้อย 50 เมตรรอบจุดเกิดเหตุ",
        regulation: "ชุดป้องกันสารเคมี + เครื่องช่วยหายใจ SCBA | อ้างอิง: UN/ADR Class 3, ERG Guide 128"
    },
    {
        unCode: "1090",
        shortName: "UN 1090 อะซิโตน",
        hazmatClass: "Class 3",
        level: "danger",
        severity: 3,
        type: "ป้ายสารเคมี Class 3 (ตัวทำละลายไวไฟสูง)",
        title: "ตัวทำละลายไวไฟสูง: อะซิโตน / ทินเนอร์ (UN 1090)",
        desc: "ของเหลวระเหยเร็วมาก ไอระเหยไวไฟสูงและก่อให้เกิดอาการวิงเวียนหรือหมดสติเมื่อสูดดมปริมาณมาก",
        action: "งดประกายไฟ ระบายอากาศให้ถ่ายเท ใช้โฟมทนแอลกอฮอล์ในการดับเพลิง",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 เมตร",
        regulation: "หน้ากากกรองไอสารอินทรีย์ (Organic Vapor) + ถุงมือบิวทิล | อ้างอิง: ADR Class 3, ERG Guide 127"
    },
    {
        unCode: "1791",
        shortName: "UN 1791 สารฟอกขาวคลอรีน",
        hazmatClass: "Class 8",
        level: "danger",
        severity: 3,
        type: "ป้ายสารเคมี Class 8 (สารกัดกร่อน)",
        title: "สารกัดกร่อน: สารละลายไฮโปคลอไรต์ / น้ำยาฟอกขาวเข้มข้น (UN 1791)",
        desc: "กัดกร่อนผิวหนังและดวงตา หากผสมกับกรดจะปล่อยก๊าซคลอรีนที่เป็นพิษร้ายแรงทันที",
        action: "ห้ามผสมกับน้ำยาล้างห้องน้ำที่เป็นกรดหรือแอมโมเนีย ล้างด้วยน้ำสะอาดปริมาณมากหากสัมผัสผิวหนัง",
        distance: "รักษาระยะห่างอย่างน้อย 30 เมตรเหนือลม",
        regulation: "แว่นครอบตา + ถุงมือยางไนไตรล์ | อ้างอิง: UN/ADR Class 8, ERG Guide 154"
    },
    {
        unCode: "1950",
        shortName: "UN 1950 กระป๋องสเปรย์อัดก๊าซ",
        hazmatClass: "Class 2.1",
        level: "warning",
        severity: 2,
        type: "ป้ายสารเคมี Class 2 (ก๊าซบรรจุภายใต้ความดัน)",
        title: "วัตถุบรรจุก๊าซอัดความดัน: กระป๋องสเปรย์ (UN 1950)",
        desc: "กระป๋องสเปรย์ภายใต้ความดัน อาจระเบิดและพุ่งกระจายเมื่อได้รับความร้อนเกิน 50°C",
        action: "เก็บให้ห่างจากเปลวไฟและแสงแดดจัด ห้ามเจาะหรือเผาทำลายกระป๋อง",
        distance: "รักษาระยะห่างจากแหล่งความร้อนอย่างน้อย 25 เมตร",
        regulation: "แว่นตานิรภัย + ถุงมือป้องกัน | อ้างอิง: UN/ADR Class 2, ERG Guide 126"
    },
    {
        unCode: "2794",
        shortName: "UN 2794 แบตเตอรี่กรดตะกั่ว",
        hazmatClass: "Class 8",
        level: "danger",
        severity: 3,
        type: "ป้ายสารเคมี Class 8 (แบตเตอรี่บรรจุกรด)",
        title: "แบตเตอรี่ชนิดเปียกบรรจุกรด (UN 2794)",
        desc: "ภายในบรรจุกรดซัลฟิวริกที่มีฤทธิ์กัดกร่อนรุนแรง และอาจเกิดก๊าซไฮโดรเจนไวไฟขณะชาร์จไฟ",
        action: "ระวังการพลิกคว่ำและการลัดวงจรขั้วแบตเตอรี่ ห้ามนำประกายไฟเข้าใกล้",
        distance: "กั้นเขตปลอดภัยอย่างน้อย 25 เมตรหากมีการรั่วไหลของน้ำกรด",
        regulation: "ถุงมือทนกรด + กระบังหน้า | อ้างอิง: UN/ADR Class 8, ERG Guide 154"
    },
    {
        unCode: "3264",
        shortName: "UN 3264 ของเหลวกรดกัดกร่อน",
        hazmatClass: "Class 8",
        level: "danger",
        severity: 3,
        type: "ป้ายสารเคมี Class 8 (ของเหลวกรดอนินทรีย์กัดกร่อน)",
        title: "ของเหลวกรดกัดกร่อนไม่ระบุชื่อเฉพาะ (UN 3264)",
        desc: "สารละลายกรดอนินทรีย์ กัดกร่อนผิวหนัง ดวงตา และโลหะอย่างรุนแรง",
        action: "หลีกเลี่ยงการสัมผัสและสูดดมไอระเหย ใช้ทรายแห้งหรือดินกั้นการรั่วไหล",
        distance: "กั้นเขตอันตรายอย่างน้อย 50 เมตรเหนือลม",
        regulation: "ชุดป้องกันสารเคมี + หน้ากากกรองไอกรด | อ้างอิง: UN/ADR Class 8, ERG Guide 154"
    }
];

// ============================================================================
// กราฟิก SVG ป้ายสี่เหลี่ยมข้าวหลามตัดมาตรฐานสากล (UN / ADR Hazmat Placards)
// ============================================================================
function getSignSVG(id) {
    switch (id) {
        case "un_1203": // Class 3 Flammable Liquid (Red)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                <path d="M60 22 C67 34, 72 40, 65 50 C70 47, 74 52, 67 60 C62 65, 53 64, 51 55 C48 48, 55 36, 60 22 Z" fill="#ffffff"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1203</text>
                <text x="60" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
            </svg>`;
        case "un_1075": // Class 2.1 Flammable Gas (Red)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                <path d="M60 22 C67 34, 72 40, 65 50 C70 47, 74 52, 67 60 C62 65, 53 64, 51 55 C48 48, 55 36, 60 22 Z" fill="#ffffff"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1075</text>
                <text x="60" y="102" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">2.1</text>
            </svg>`;
        case "un_1789": // Class 8 Corrosive (White/Black)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <polygon points="5,60 115,60 60,115" fill="#0f172a"/>
                <rect x="33" y="42" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="56" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1789</text>
                <text x="60" y="101" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">8</text>
            </svg>`;
        case "un_1830": // Class 8 Sulfuric Acid
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <polygon points="5,60 115,60 60,115" fill="#0f172a"/>
                <rect x="33" y="42" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="56" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1830</text>
                <text x="60" y="101" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">8</text>
            </svg>`;
        case "un_1824": // Class 8 Sodium Hydroxide
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <polygon points="5,60 115,60 60,115" fill="#0f172a"/>
                <rect x="33" y="42" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="56" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1824</text>
                <text x="60" y="101" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">8</text>
            </svg>`;
        case "un_1017": // Class 2.3 Toxic Gas (White with Skull)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <circle cx="60" cy="34" r="9" fill="#0f172a"/>
                <line x1="48" y1="48" x2="72" y2="38" stroke="#0f172a" stroke-width="3"/>
                <line x1="48" y1="38" x2="72" y2="48" stroke="#0f172a" stroke-width="3"/>
                <rect x="33" y="56" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="70" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1017</text>
                <text x="60" y="100" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">2.3</text>
            </svg>`;
        case "un_1005": // Class 2.3 Ammonia
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <circle cx="60" cy="34" r="9" fill="#0f172a"/>
                <line x1="48" y1="48" x2="72" y2="38" stroke="#0f172a" stroke-width="3"/>
                <line x1="48" y1="38" x2="72" y2="48" stroke="#0f172a" stroke-width="3"/>
                <rect x="33" y="56" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="70" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1005</text>
                <text x="60" y="100" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">2.3</text>
            </svg>`;
        case "un_1689": // Class 6.1 Toxic (White with Skull)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <circle cx="60" cy="33" r="9" fill="#0f172a"/>
                <line x1="47" y1="47" x2="73" y2="37" stroke="#0f172a" stroke-width="3"/>
                <line x1="47" y1="37" x2="73" y2="47" stroke="#0f172a" stroke-width="3"/>
                <rect x="33" y="56" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="70" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1689</text>
                <text x="60" y="100" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">6.1</text>
            </svg>`;
        case "un_1202": // Class 3 Diesel
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                <path d="M60 22 C67 34, 72 40, 65 50 C70 47, 74 52, 67 60 C62 65, 53 64, 51 55 C48 48, 55 36, 60 22 Z" fill="#ffffff"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1202</text>
                <text x="60" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
            </svg>`;
        case "un_1170": // Class 3 Ethanol
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                <path d="M60 22 C67 34, 72 40, 65 50 C70 47, 74 52, 67 60 C62 65, 53 64, 51 55 C48 48, 55 36, 60 22 Z" fill="#ffffff"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1170</text>
                <text x="60" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
            </svg>`;
        case "un_1428": // Class 4.3 Dangerous When Wet (Blue)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#1d4ed8" stroke="#ffffff" stroke-width="3"/>
                <path d="M60 22 C67 34, 72 40, 65 50 C70 47, 74 52, 67 60 C62 65, 53 64, 51 55 C48 48, 55 36, 60 22 Z" fill="#ffffff"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1428</text>
                <text x="60" y="102" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">4.3</text>
            </svg>`;
        case "un_1350": // Class 4.1 Flammable Solid (Red & White Stripes)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#dc2626" stroke-width="3"/>
                <rect x="34" y="34" width="10" height="52" fill="#dc2626"/>
                <rect x="55" y="20" width="10" height="80" fill="#dc2626"/>
                <rect x="76" y="34" width="10" height="52" fill="#dc2626"/>
                <rect x="33" y="54" width="54" height="19" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="68" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1350</text>
                <text x="60" y="100" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">4.1</text>
            </svg>`;
        case "un_2014": // Class 5.1 Oxidizer (Yellow)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#facc15" stroke="#0f172a" stroke-width="3"/>
                <circle cx="60" cy="40" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
                <path d="M55 28 L60 18 L65 28" fill="#0f172a"/>
                <rect x="33" y="58" width="54" height="19" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="72" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">2014</text>
                <text x="60" y="100" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">5.1</text>
            </svg>`;
        case "un_0336": // Class 1 Explosive (Orange)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#f97316" stroke="#0f172a" stroke-width="3"/>
                <polygon points="60,20 65,33 78,28 70,40 82,47 68,49 71,61 60,53 49,61 52,49 38,47 50,40 42,28 55,33" fill="#0f172a"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">0336</text>
                <text x="60" y="101" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">1.4</text>
            </svg>`;
        case "un_2915": // Class 7 Radioactive (Yellow/White)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <polygon points="60,5 115,60 5,60" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
                <circle cx="60" cy="40" r="4" fill="#0f172a"/>
                <path d="M60 40 L52 26 A15 15 0 0 1 68 26 Z" fill="#0f172a"/>
                <path d="M60 40 L75 40 A15 15 0 0 1 68 53 Z" fill="#0f172a"/>
                <path d="M60 40 L52 53 A15 15 0 0 1 45 40 Z" fill="#0f172a"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">2915</text>
                <text x="60" y="101" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">7</text>
            </svg>`;
        case "un_3082": // Class 9 Miscellaneous (Striped Top + White Bottom)
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
                <rect x="35" y="32" width="8" height="28" fill="#0f172a"/>
                <rect x="56" y="16" width="8" height="44" fill="#0f172a"/>
                <rect x="77" y="32" width="8" height="28" fill="#0f172a"/>
                <rect x="33" y="62" width="54" height="19" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
                <text x="60" y="76" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">3082</text>
                <text x="60" y="101" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">9</text>
            </svg>`;
        case "traffic_stop":
            return `<svg viewBox="0 0 120 120">
                <polygon points="38,8 82,8 112,38 112,82 82,112 38,112 8,82 8,38" fill="#dc2626" stroke="#ffffff" stroke-width="4"/>
                <text x="60" y="56" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">หยุด</text>
                <text x="60" y="78" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">STOP</text>
            </svg>`;
        case "traffic_no_overtaking":
            return `<svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="#ffffff" stroke="#dc2626" stroke-width="11"/>
                <rect x="32" y="48" width="22" height="26" rx="4" fill="#dc2626"/>
                <rect x="66" y="48" width="22" height="26" rx="4" fill="#0f172a"/>
                <line x1="24" y1="24" x2="96" y2="96" stroke="#dc2626" stroke-width="9"/>
            </svg>`;
        case "traffic_speed_60":
            return `<svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="#ffffff" stroke="#dc2626" stroke-width="11"/>
                <text x="60" y="74" font-size="42" font-weight="bold" fill="#0f172a" text-anchor="middle">60</text>
            </svg>`;
        case "traffic_curve":
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,8 112,60 60,112 8,60" fill="#facc15" stroke="#0f172a" stroke-width="5"/>
                <path d="M52 86 L52 62 C52 50, 68 48, 68 36" fill="none" stroke="#0f172a" stroke-width="9" stroke-linecap="round"/>
                <polygon points="68,26 58,40 78,40" fill="#0f172a"/>
            </svg>`;
        case "safety_high_voltage":
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,10 112,104 8,104" fill="#facc15" stroke="#0f172a" stroke-width="6" stroke-linejoin="round"/>
                <polygon points="64,34 44,68 59,68 53,94 76,58 61,58" fill="#0f172a"/>
            </svg>`;
        case "safety_wet_floor":
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,10 112,104 8,104" fill="#facc15" stroke="#0f172a" stroke-width="6" stroke-linejoin="round"/>
                <circle cx="66" cy="44" r="5" fill="#0f172a"/>
                <path d="M62 52 L52 68 L38 74 M56 62 L72 74 L68 88" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none"/>
                <line x1="32" y1="92" x2="88" y2="92" stroke="#0f172a" stroke-width="4"/>
            </svg>`;
        case "safety_ppe_helmet":
            return `<svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="#0284c7" stroke="#ffffff" stroke-width="4"/>
                <path d="M32 62 C32 42, 88 42, 88 62 Z" fill="#ffffff"/>
                <rect x="26" y="61" width="68" height="7" rx="3" fill="#ffffff"/>
                <circle cx="60" cy="76" r="10" fill="none" stroke="#ffffff" stroke-width="4"/>
            </svg>`;
        default:
            // ป้าย UN Placard อัตโนมัติสำหรับรหัสค้นหาเสริม
            return `<svg viewBox="0 0 120 120">
                <polygon points="60,5 115,60 60,115 5,60" fill="#f97316" stroke="#ffffff" stroke-width="3"/>
                <rect x="28" y="48" width="64" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
                <text x="60" y="65" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">${id}</text>
            </svg>`;
    }
}

// ============================================================================
// ตัวแปรสถานะ (State) และ LocalStorage
// ============================================================================
const STORAGE_KEY = "hazmat_sign_scanner_custom_v3";
let customSigns = [];
let currentCategory = "hazmat"; // เริ่มต้นที่หมวดสารเคมีเป็นหลัก
let selectedSignId = DEFAULT_SIGN_DATABASE[0].id;
let isUploadedCustomImage = false;
let uploadedImageDataUrl = "";
let lastAiPrediction = null;
let currentSpeechText = "";
let scanHistory = [];

function getAllSigns() {
    return [...customSigns, ...DEFAULT_SIGN_DATABASE];
}

function loadCustomSigns() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) customSigns = JSON.parse(saved);
    } catch (e) {
        customSigns = [];
    }
}

function persistCustomSigns() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customSigns));
    } catch (e) {
        alert("พื้นที่จัดเก็บบนเบราว์เซอร์เต็ม กรุณาลบป้ายเก่าบางรายการออกก่อนครับ");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCustomSigns();
    filterCategory("hazmat");
    selectPresetSign(DEFAULT_SIGN_DATABASE[0].id);
});

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === category);
    });
    renderPresetGrid();
}

function renderPresetGrid() {
    const grid = document.getElementById("presetGrid");
    const allSigns = getAllSigns();
    const filtered = currentCategory === "all"
        ? allSigns
        : allSigns.filter(item => item.category === currentCategory);

    document.getElementById("presetCount").innerText = `${filtered.length} รายการ`;
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; color:#64748b; padding:18px; font-size:0.84rem;">
            ยังไม่มีป้ายในหมวดนี้ — กด "ถ่ายรูปป้าย / อัปโหลด" ให้ AI วิเคราะห์และบันทึกได้เลยครับ
        </div>`;
        return;
    }

    filtered.forEach(sign => {
        const div = document.createElement("div");
        div.className = `preset-item ${(!isUploadedCustomImage && sign.id === selectedSignId) ? "selected" : ""}`;
        div.onclick = () => selectPresetSign(sign.id);

        const thumbHtml = sign.customImage
            ? `<img src="${sign.customImage}" alt="${sign.shortName}">`
            : getSignSVG(sign.id);

        const deleteBtnHtml = sign.isCustom
            ? `<button type="button" class="btn-delete-sign" title="ลบป้ายนี้ออกจากรายการ" onclick="deleteCustomSign(event, '${sign.id}')">×</button>`
            : "";

        const classBadge = sign.hazmatClass
            ? `<span class="class-pill">${sign.hazmatClass}</span>`
            : "";

        div.innerHTML = `
            ${deleteBtnHtml}
            ${classBadge}
            <div class="preset-thumb">${thumbHtml}</div>
            <div class="preset-name">${sign.shortName}</div>
        `;
        grid.appendChild(div);
    });
}

function selectPresetSign(id) {
    selectedSignId = id;
    isUploadedCustomImage = false;
    uploadedImageDataUrl = "";
    lastAiPrediction = null;

    const sign = getAllSigns().find(s => s.id === id);
    if (!sign) return;

    const imgEl = document.getElementById("previewImage");
    const svgContainer = document.getElementById("previewSvgContainer");

    if (sign.customImage) {
        svgContainer.style.display = "none";
        imgEl.src = sign.customImage;
        imgEl.style.display = "block";
    } else {
        imgEl.style.display = "none";
        svgContainer.style.display = "block";
        svgContainer.innerHTML = getSignSVG(id);
    }

    document.getElementById("resultCard").style.display = "none";
    document.getElementById("saveSignBox").style.display = "none";
    renderPresetGrid();
}

// ============================================================================
// ฟังก์ชันค้นหารหัส UN Number หรือชื่อสารเคมี (เช่น เจอรถบรรทุกขนสารแต่ไม่รู้ว่าคืออะไร)
// ============================================================================
function quickLookup(code) {
    document.getElementById("unSearchInput").value = code;
    searchUnCode();
}

function searchUnCode() {
    const rawQuery = document.getElementById("unSearchInput").value.trim().toUpperCase().replace(/^UN\s*/i, "");
    if (!rawQuery) {
        alert("กรุณากรอกรหัสตัวเลข 4 หลัก (เช่น 1203, 1075, 1830) หรือชื่อสารเคมีครับ");
        return;
    }

    // 1. ค้นหาในฐานข้อมูลป้ายหลัก 16 ชนิด + ป้ายที่บันทึกเอง
    const foundMain = getAllSigns().find(s =>
        (s.unCode && s.unCode === rawQuery) ||
        s.shortName.toUpperCase().includes(rawQuery) ||
        s.title.toUpperCase().includes(rawQuery) ||
        (s.keywords && s.keywords.some(k => k.toUpperCase().includes(rawQuery)))
    );

    if (foundMain) {
        if (foundMain.category === "hazmat" && currentCategory !== "hazmat" && currentCategory !== "all") {
            filterCategory("hazmat");
        }
        selectPresetSign(foundMain.id);
        displayResult(foundMain, false, `ค้นหาจากรหัส UN ${foundMain.unCode || rawQuery}`);
        return;
    }

    // 2. ค้นหาในฐานข้อมูลรหัส UN Number เสริม
    const foundExtra = EXTRA_UN_LOOKUP_DB.find(item =>
        item.unCode === rawQuery ||
        item.shortName.toUpperCase().includes(rawQuery) ||
        item.title.toUpperCase().includes(rawQuery)
    );

    if (foundExtra) {
        isUploadedCustomImage = false;
        const imgEl = document.getElementById("previewImage");
        const svgContainer = document.getElementById("previewSvgContainer");
        imgEl.style.display = "none";
        svgContainer.style.display = "block";
        svgContainer.innerHTML = getSignSVG(foundExtra.unCode);

        displayResult({
            ...foundExtra,
            ocrSample: `UN ${foundExtra.unCode} | ${foundExtra.hazmatClass} (ฐานข้อมูลวัตถุอันตราย UN/ADR)`
        }, false, `ฐานข้อมูล UN ${foundExtra.unCode}`);
        return;
    }

    // 3. กรณีไม่พบรหัสในฐานข้อมูล -> แจ้งเตือนความปลอดภัยเบื้องต้นสำหรับรถขนสารเคมีไม่ทราบชนิด
    displayResult({
        type: "รหัสสารเคมีเฉพาะทาง (ไม่อยู่ในรายการหลัก)",
        level: "danger",
        severity: 3,
        ocrSample: `รหัสที่ค้นหา: UN ${rawQuery}`,
        title: `ไม่พบรหัส UN ${rawQuery} ในฐานข้อมูลย่อย — โปรดรักษาระยะปลอดภัย`,
        desc: `รหัส UN ${rawQuery} เป็นวัตถุอันตรายเฉพาะทาง ให้สังเกตสีของป้ายสี่เหลี่ยมข้าวหลามตัดท้ายรถบรรทุก (สีแดง = ไวไฟ, สีขาว/หัวกะโหลก = สารพิษ, สีขาว-ดำ = กัดกร่อน, สีเหลือง = ออกซิไดซ์)`,
        action: "ห้ามเข้าใกล้จุดรั่วไหล ดับเครื่องยนต์ งดก่อประกายไฟ และอยู่เหนือลมเสมอ",
        distance: "รักษาระยะห่างปลอดภัยเบื้องต้นอย่างน้อย 50 - 100 เมตรตามคู่มือ ERG",
        regulation: "หากต้องการบันทึกข้อมูลรหัสนี้เก็บไว้ สามารถถ่ายรูปป้ายและกดบันทึกเข้าสู่รายการได้ครับ"
    }, false, "คำเตือนความปลอดภัยฉุกเฉิน");
}

// ============================================================================
// จัดการอัปโหลดภาพและวิเคราะห์ด้วย AI for Thai OCR + Vision
// ============================================================================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        resizeImageDataUrl(e.target.result, 480, (compressedDataUrl) => {
            isUploadedCustomImage = true;
            uploadedImageDataUrl = compressedDataUrl;

            const imgEl = document.getElementById("previewImage");
            const svgContainer = document.getElementById("previewSvgContainer");

            svgContainer.style.display = "none";
            imgEl.src = compressedDataUrl;
            imgEl.style.display = "block";

            document.getElementById("resultCard").style.display = "none";
            document.getElementById("saveSignBox").style.display = "none";
            renderPresetGrid();
        });
    };
    reader.readAsDataURL(file);
}

function resizeImageDataUrl(dataUrl, maxDimension, callback) {
    const img = new Image();
    img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
            if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
            } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
            }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = dataUrl;
}

function analyzeDominantSignColor(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 60, 60);

            const pixels = ctx.getImageData(0, 0, 60, 60).data;
            let redCount = 0, yellowCount = 0, orangeCount = 0, blueCount = 0;

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
                if (r > 165 && g < 80 && b < 80) redCount++;
                else if (r > 190 && g > 90 && g < 155 && b < 70) orangeCount++;
                else if (r > 180 && g > 155 && b < 85) yellowCount++;
                else if (b > 145 && r < 95) blueCount++;
            }

            const max = Math.max(redCount, yellowCount, orangeCount, blueCount);
            if (max < 40) {
                resolve({ colorName: "สีขาว-ดำ (กลุ่มสารพิษ/สารกัดกร่อน)", suggestedCat: "hazmat", suggestedLevel: "danger", severity: 3, label: "ป้ายสารเคมีกลุ่มกัดกร่อน หรือสารพิษ" });
            } else if (max === redCount) {
                resolve({ colorName: "สีแดง (วัตถุไวไฟสูง / ป้ายห้าม)", suggestedCat: "hazmat", suggestedLevel: "danger", severity: 3, label: "ป้ายวัตถุไวไฟ (Class 2.1 / Class 3)" });
            } else if (max === orangeCount) {
                resolve({ colorName: "สีส้ม (ป้ายรหัส UN / วัตถุระเบิด)", suggestedCat: "hazmat", suggestedLevel: "critical", severity: 4, label: "ป้ายรหัส UN Number รถบรรทุกสารเคมี" });
            } else if (max === yellowCount) {
                resolve({ colorName: "สีเหลือง (สารออกซิไดซ์ / ป้ายเตือน)", suggestedCat: "hazmat", suggestedLevel: "warning", severity: 2, label: "ป้ายสารออกซิไดซ์ (Class 5) หรือป้ายเตือน" });
            } else {
                resolve({ colorName: "สีน้ำเงิน/ฟ้า (สารอันตรายเมื่อเปียกน้ำ / PPE)", suggestedCat: "hazmat", suggestedLevel: "danger", severity: 3, label: "ป้ายสารห้ามโดนน้ำ (Class 4.3) หรือข้อบังคับ" });
            }
        };
        img.src = dataUrl;
    });
}

async function startScan() {
    const btnScan = document.getElementById("btnScan");
    const laser = document.getElementById("laserLine");
    const statusOverlay = document.getElementById("scanStatus");

    btnScan.disabled = true;
    laser.style.display = "block";
    statusOverlay.style.display = "block";
    document.getElementById("resultCard").style.display = "none";
    document.getElementById("saveSignBox").style.display = "none";

    if (!isUploadedCustomImage) {
        statusOverlay.innerText = "⏳ กำลังตรวจสอบข้อมูลสารเคมีและระดับอันตราย...";
        await sleep(550);

        laser.style.display = "none";
        statusOverlay.style.display = "none";
        btnScan.disabled = false;

        const signData = getAllSigns().find(s => s.id === selectedSignId);
        if (signData) {
            displayResult(signData, false, "ฐานข้อมูลมาตรฐาน UN/ADR");
        }
        return;
    }

    await runIntelligentSignRecognition();

    laser.style.display = "none";
    statusOverlay.style.display = "none";
    btnScan.disabled = false;
}

async function runIntelligentSignRecognition() {
    const fileInput = document.getElementById("imageInput");
    const statusOverlay = document.getElementById("scanStatus");
    const file = fileInput.files[0];

    if (!file) return;

    statusOverlay.innerText = "🌐 กำลังอ่านรหัส UN และตัวอักษรด้วย AI for Thai OCR...";

    let rawOcrText = "";
    let visionTags = [];
    let apiConnected = false;

    try {
        const ocrForm = new FormData();
        ocrForm.append("uploadfile", file);

        const tagForm = new FormData();
        tagForm.append("file", file);

        const [ocrRes, tagRes] = await Promise.allSettled([
            fetch(AI_FOR_THAI_OCR_ENDPOINT, {
                method: "POST",
                headers: { "Apikey": AI_FOR_THAI_API_KEY },
                body: ocrForm
            }),
            fetch(AI_FOR_THAI_TAG_ENDPOINT, {
                method: "POST",
                headers: { "Apikey": AI_FOR_THAI_API_KEY },
                body: tagForm
            })
        ]);

        if (ocrRes.status === "fulfilled" && ocrRes.value.ok) {
            const ocrData = await ocrRes.value.json();
            rawOcrText = (ocrData.text || ocrData.result || "").trim();
            apiConnected = true;
        }

        if (tagRes.status === "fulfilled" && tagRes.value.ok) {
            const tagData = await tagRes.value.json();
            if (Array.isArray(tagData.tags)) {
                visionTags = tagData.tags.map(t => (typeof t === "string" ? t : t.tag || "")).filter(Boolean);
            }
            apiConnected = true;
        }
    } catch (err) {
        console.warn("การเชื่อมต่อ AI API จากเบราว์เซอร์โดยตรงมีข้อจำกัด CORS:", err);
    }

    statusOverlay.innerText = "🧠 กำลังเทียบฐานรหัส UN และวิเคราะห์สีป้ายสารเคมี...";
    const colorInfo = await analyzeDominantSignColor(uploadedImageDataUrl);
    await sleep(350);

    const combinedText = `${rawOcrText} ${visionTags.join(" ")} ${file.name}`.toUpperCase();

    // 1. ตรวจจับตัวเลข 4 หลัก (UN Number) จากผลอ่าน OCR หรือชื่อไฟล์
    const unMatch = combinedText.match(/\b(0\d{3}|1\d{3}|2\d{3}|3\d{3})\b/);
    const detectedUnCode = unMatch ? unMatch[1] : null;

    // 2. ค้นหาในฐานข้อมูลป้ายหลัก 16 ชนิด + ป้ายที่บันทึกเอง
    const existingSign = getAllSigns().find(sign =>
        (detectedUnCode && sign.unCode === detectedUnCode) ||
        (sign.keywords && sign.keywords.some(kw => combinedText.includes(kw.toUpperCase())))
    );

    if (existingSign) {
        displayResult({
            ...existingSign,
            ocrSample: rawOcrText
                ? `AI OCR: "${rawOcrText}" | สีป้าย: ${colorInfo.colorName}`
                : `ตรวจพบรหัส UN ${existingSign.unCode || ""} (${colorInfo.colorName})`
        }, false, apiConnected ? "AI for Thai + ฐานข้อมูล UN" : "ระบบจำแนก UN อัตโนมัติ");
        return;
    }

    // 3. ค้นหาในฐานข้อมูลรหัส UN เสริม
    const extraMatch = EXTRA_UN_LOOKUP_DB.find(item =>
        (detectedUnCode && item.unCode === detectedUnCode) ||
        combinedText.includes(item.unCode)
    );

    if (extraMatch) {
        lastAiPrediction = extraMatch;
        displayResult({
            ...extraMatch,
            ocrSample: rawOcrText
                ? `AI OCR: "${rawOcrText}" | วิเคราะห์สี: ${colorInfo.colorName}`
                : `ตรวจพบรหัส UN ${extraMatch.unCode} | สี: ${colorInfo.colorName}`
        }, true, "AI ระบุข้อมูลจากรหัส UN สำเร็จ");
        return;
    }

    // 4. กรณีเป็นป้ายใหม่ที่ยังไม่รู้จัก -> AI สร้างข้อมูลเบื้องต้นจากสีและรหัสที่อ่านได้
    const titleLabel = detectedUnCode
        ? `ตรวจพบรหัส UN ${detectedUnCode} (${colorInfo.label})`
        : (rawOcrText ? `ตรวจพบข้อความ: "${rawOcrText}"` : `${colorInfo.label}`);

    const synthesizedSign = {
        shortName: detectedUnCode ? `UN ${detectedUnCode}` : (rawOcrText ? rawOcrText.slice(0, 20) : colorInfo.label),
        category: colorInfo.suggestedCat,
        type: `${colorInfo.label} (วิเคราะห์อัตโนมัติโดย AI)`,
        level: colorInfo.suggestedLevel,
        severity: colorInfo.severity,
        ocrSample: `AI OCR: "${rawOcrText || "ไม่พบตัวเลขชัดเจน"}" | สีเด่น: ${colorInfo.colorName}`,
        title: `ผลการวิเคราะห์เบื้องต้น: ${titleLabel}`,
        desc: `AI ตรวจพบป้ายที่มีลักษณะ${colorInfo.colorName} จัดอยู่ในกลุ่ม${colorInfo.label} หากเป็นรถบรรทุกขนสารเคมี โปรดรักษาระยะห่างและหลีกเลี่ยงการสูดดมไอระเหย`,
        action: "อยู่เหนือลม ดับเครื่องยนต์ งดก่อประกายไฟ และตรวจสอบเลข UN 4 หลักบนแผ่นป้ายสีส้ม",
        distance: "รักษาระยะห่างปลอดภัยเบื้องต้นอย่างน้อย 50 - 100 เมตร",
        regulation: "วิเคราะห์จาก AI for Thai OCR & Vision ร่วมกับมาตรฐานสีป้ายวัตถุอันตราย UN/ADR"
    };

    lastAiPrediction = synthesizedSign;
    displayResult(synthesizedSign, true, "AI วิเคราะห์เบื้องต้นอัตโนมัติ");
}

// ============================================================================
// แสดงผลลัพธ์ + แถบวัดระดับความอันตราย 4 ระดับ + เติมข้อมูลบันทึกอัตโนมัติ
// ============================================================================
function updateHazardMeter(level, severityNum) {
    const levelConfig = {
        critical: { score: 4, text: "ระดับ 4 - วิกฤต / อันตรายถึงชีวิต (Critical)", color: "#f87171" },
        danger: { score: 3, text: "ระดับ 3 - อันตรายสูง (High Hazard)", color: "#fb923c" },
        warning: { score: 2, text: "ระดับ 2 - เฝ้าระวังอันตราย (Moderate)", color: "#fbbf24" },
        info: { score: 1, text: "ระดับ 1 - ข้อบังคับความปลอดภัย (Low / PPE)", color: "#38bdf8" }
    };

    const cfg = levelConfig[level] || levelConfig.danger;
    const score = severityNum || cfg.score;

    const labelEl = document.getElementById("hazardLevelText");
    labelEl.innerText = cfg.text;
    labelEl.style.color = cfg.color;

    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById(`hbar${i}`);
        bar.className = "h-bar";
        if (i <= score) {
            bar.classList.add(`active-${score}`);
        }
    }
}

function displayResult(info, allowSaveAsNew, sourceTagText = "AI Analysis") {
    const card = document.getElementById("resultCard");
    const badge = document.getElementById("resultBadge");

    card.className = `result-card level-${info.level}`;
    badge.className = `badge level-${info.level}`;

    badge.innerText = info.type;
    document.getElementById("resultSourceTag").innerText = sourceTagText;
    updateHazardMeter(info.level, info.severity);

    document.getElementById("resultTitle").innerText = info.title;
    document.getElementById("resultOcr").innerText = info.ocrSample;
    document.getElementById("resultDesc").innerText = info.desc;

    document.getElementById("detailAction").innerText = info.action || "ปฏิบัติตามคำแนะนำอย่างเคร่งครัด";
    document.getElementById("detailDistance").innerText = info.distance || "รักษาระยะปลอดภัยอย่างน้อย 50 เมตร";
    document.getElementById("detailRegulation").innerText = info.regulation || "มาตรฐานวัตถุอันตราย UN/ADR";

    const saveBox = document.getElementById("saveSignBox");
    if (allowSaveAsNew && uploadedImageDataUrl) {
        saveBox.style.display = "block";
        document.getElementById("newSignName").value = info.shortName || info.title;
        document.getElementById("newSignCategory").value = info.category || "hazmat";
        document.getElementById("newSignLevel").value = info.level || "danger";
        document.getElementById("newSignDesc").value = info.desc || "";
        document.getElementById("newSignAction").value = info.action || "";
    } else {
        saveBox.style.display = "none";
    }

    card.style.display = "block";

    const levelSpeak = document.getElementById("hazardLevelText").innerText;
    currentSpeechText = `${info.title}. ${levelSpeak}. ${info.desc}. วิธีปฏิบัติตน: ${info.action || ""}`;

    if (document.getElementById("autoSpeakToggle").checked) {
        speakCurrentResult();
    }

    addHistoryItem(info.title, info.level);
}

// ============================================================================
// บันทึกป้ายใหม่เข้าสู่รายการ และ ลบป้ายออกจากรายการ
// ============================================================================
function saveNewCustomSign() {
    const nameInput = document.getElementById("newSignName").value.trim();
    const category = document.getElementById("newSignCategory").value;
    const level = document.getElementById("newSignLevel").value;
    const descInput = document.getElementById("newSignDesc").value.trim();
    const actionInput = document.getElementById("newSignAction").value.trim();

    if (!nameInput) {
        alert("กรุณาระบุชื่อป้ายหรือรหัส UN ก่อนบันทึกครับ");
        return;
    }

    const levelLabels = {
        critical: "ป้ายสารเคมีอันตรายวิกฤต (บันทึกในระบบ)",
        danger: "ป้ายเตือนอันตรายสูง (บันทึกในระบบ)",
        warning: "ป้ายเฝ้าระวัง / เตือน (บันทึกในระบบ)",
        info: "ป้ายข้อบังคับ / ข้อมูล (บันทึกในระบบ)"
    };

    const severityMap = { critical: 4, danger: 3, warning: 2, info: 1 };

    const newSignObj = {
        id: "custom_" + Date.now(),
        isCustom: true,
        customImage: uploadedImageDataUrl,
        category: category,
        hazmatClass: "บันทึกเอง",
        shortName: nameInput,
        type: levelLabels[level] || "ป้ายที่บันทึกเอง",
        level: level,
        severity: severityMap[level] || 3,
        keywords: [nameInput],
        ocrSample: lastAiPrediction ? lastAiPrediction.ocrSample : `บันทึกจากภาพถ่าย: ${nameInput}`,
        title: nameInput,
        desc: descInput || `ป้ายสัญลักษณ์ "${nameInput}"`,
        action: actionInput || "ปฏิบัติตามคำแนะนำของป้ายอย่างเคร่งครัด",
        distance: lastAiPrediction ? lastAiPrediction.distance : "รักษาระยะปลอดภัยอย่างน้อย 50 เมตร",
        regulation: lastAiPrediction ? lastAiPrediction.regulation : "บันทึกและตรวจสอบข้อมูลโดยผู้ใช้งาน"
    };

    customSigns.unshift(newSignObj);
    persistCustomSigns();

    document.getElementById("saveSignBox").style.display = "none";
    selectPresetSign(newSignObj.id);
    displayResult(newSignObj, false, "บันทึกในรายการแล้ว");
    alert(`บันทึก "${nameInput}" เข้าสู่รายการเรียบร้อยแล้วครับ`);
}

function deleteCustomSign(event, id) {
    event.stopPropagation();
    const target = customSigns.find(s => s.id === id);
    if (!target) return;

    if (confirm(`ต้องการลบป้าย "${target.shortName}" ออกจากรายการใช่หรือไม่?`)) {
        customSigns = customSigns.filter(s => s.id !== id);
        persistCustomSigns();

        if (selectedSignId === id) {
            selectPresetSign(DEFAULT_SIGN_DATABASE[0].id);
        } else {
            renderPresetGrid();
        }
    }
}

// ============================================================================
// ระบบอ่านเสียงภาษาไทย คัดลอกผล และประวัติการสแกน
// ============================================================================
function speakCurrentResult() {
    if (!currentSpeechText || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSpeechText);
    utterance.lang = "th-TH";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}

function copyResultText() {
    const title = document.getElementById("resultTitle").innerText;
    const type = document.getElementById("resultBadge").innerText;
    const levelText = document.getElementById("hazardLevelText").innerText;
    const desc = document.getElementById("resultDesc").innerText;
    const action = document.getElementById("detailAction").innerText;
    const distance = document.getElementById("detailDistance").innerText;
    const regulation = document.getElementById("detailRegulation").innerText;

    const textToCopy = `[${type}] ${title}\nระดับความอันตราย: ${levelText}\nรายละเอียด: ${desc}\nการปฏิบัติตน: ${action}\nระยะปลอดภัย: ${distance}\nอ้างอิง/PPE: ${regulation}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("คัดลอกสรุปผลการสแกนเรียบร้อยแล้วครับ");
    });
}

function addHistoryItem(title, level) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    scanHistory.unshift({ title, level, timeStr });
    if (scanHistory.length > 5) scanHistory.pop();

    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if (scanHistory.length === 0) {
        list.innerHTML = `<li class="history-item"><span>ยังไม่มีประวัติการสแกน</span></li>`;
        return;
    }

    list.innerHTML = scanHistory.map(item => `
        <li class="history-item">
            <strong>${item.title}</strong>
            <span>${item.timeStr}</span>
        </li>
    `).join("");
}

function clearHistory() {
    scanHistory = [];
    renderHistory();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}