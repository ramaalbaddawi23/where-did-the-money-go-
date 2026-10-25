/* ==========================================================================
   بيانات أولية للتطبيق (Seed Data)
   18 معاملة مالية واقعية باللغة العربية مع تواريخ ديناميكية
   بحيث تعمل تصنيفات (هذا الأسبوع / هذا الشهر) في أي وقت تُقام فيه الورشة!
   ========================================================================== */

/**
 * دالة مساعدة لتوليد تاريخ بصيغة YYYY-MM-DD نسبة لليوم
 * Helper function to create dates relative to today:
 * 0 = اليوم، -1 = أمس، -5 = قبل 5 أيام، إلخ
 */
function getRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const initialTransactions = [
  // --- دخل ومصاريف هذا الأسبوع (This Week: 0 to -6 days) ---
  {
    id: 1,
    title: "قهوة وكرواسون مع زملاء العمل",
    amount: 18.5,
    type: "expense",
    category: "طعام ومشروبات",
    date: getRelativeDate(0) // اليوم
  },
  {
    id: 2,
    title: "مشروع فريلانس وتصميم واجهة",
    amount: 850,
    type: "income",
    category: "راتب ودخل",
    date: getRelativeDate(-1) // أمس
  },
  {
    id: 3,
    title: "بنزين السيارة",
    amount: 85,
    type: "expense",
    category: "مواصلات وبنزين",
    date: getRelativeDate(-2) // قبل يومين
  },
  {
    id: 4,
    title: "شراء وجبة غداء من المطعم",
    amount: 45,
    type: "expense",
    category: "طعام ومشروبات",
    date: getRelativeDate(-3)
  },
  {
    id: 5,
    title: "مشتريات بقالة وسوبرماركت",
    amount: 195,
    type: "expense",
    category: "طعام ومشروبات",
    date: getRelativeDate(-5)
  },

  // --- مصاريف ودخل إضافي خلال هذا الشهر (This Month: -8 to -25 days) ---
  {
    id: 6,
    title: "الراتب الشهري الأساسي",
    amount: 5200,
    type: "income",
    category: "راتب ودخل",
    date: getRelativeDate(-9)
  },
  {
    id: 7,
    title: "فاتورة الإنترنت والكهرباء",
    amount: 220,
    type: "expense",
    category: "فواتير وسكن",
    date: getRelativeDate(-11)
  },
  {
    id: 8,
    title: "شراء حذاء رياضي جديد",
    amount: 260,
    type: "expense",
    category: "تسوق وترفيه",
    date: getRelativeDate(-13)
  },
  {
    id: 9,
    title: "توصيل طلبية وتكاسي (أوبر/كريم)",
    amount: 55,
    type: "expense",
    category: "مواصلات وبنزين",
    date: getRelativeDate(-15)
  },
  {
    id: 10,
    title: "اشتراك النادي الرياضي (شهر)",
    amount: 150,
    type: "expense",
    category: "صحة ورياضة",
    date: getRelativeDate(-17)
  },
  {
    id: 11,
    title: "أدوية وفيتامينات من الصيدلية",
    amount: 80,
    type: "expense",
    category: "صحة ورياضة",
    date: getRelativeDate(-19)
  },
  {
    id: 12,
    title: "مكافأة إنجاز مشروع سنوي",
    amount: 600,
    type: "income",
    category: "راتب ودخل",
    date: getRelativeDate(-21)
  },
  {
    id: 13,
    title: "عشاء عائلي نهاية الأسبوع",
    amount: 280,
    type: "expense",
    category: "طعام ومشروبات",
    date: getRelativeDate(-23)
  },
  {
    id: 14,
    title: "اشتراك نيتفليكس وخدمات سحابية",
    amount: 45,
    type: "expense",
    category: "تسوق وترفيه",
    date: getRelativeDate(-25)
  },

  // --- مصاريف الشهر الماضي (Past month: -35 to -50 days) ---
  {
    id: 15,
    title: "إيجار الشقة السكني",
    amount: 1400,
    type: "expense",
    category: "فواتير وسكن",
    date: getRelativeDate(-35)
  },
  {
    id: 16,
    title: "صيانة دورية وتغيير زيت السيارة",
    amount: 190,
    type: "expense",
    category: "مواصلات وبنزين",
    date: getRelativeDate(-40)
  },
  {
    id: 17,
    title: "هدية عيد ميلاد صديق",
    amount: 120,
    type: "expense",
    category: "أخرى",
    date: getRelativeDate(-45)
  },
  {
    id: 18,
    title: "بيع جهاز إلكتروني قديم مستعمل",
    amount: 350,
    type: "income",
    category: "راتب ودخل",
    date: getRelativeDate(-48)
  }
];
