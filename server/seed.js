// server/seed.js

const mongoose = require('mongoose');
const Scenario = require('./models/Scenario');
require('dotenv').config({ path: './.env' }); // بارگذاری فایل env

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  // حذف همه سناریوهای قبلی (اختیاری)
  await Scenario.deleteMany({});

  // ایجاد سناریوی جدید
  const scenario = new Scenario({
    name: "کاپو",
    roles: [
      "رئیس مافیا",
      "جلاد",
      "جادوگر",
      "زره‌ساز",
      "کارآگاه",
      "وارث",
      "شهروند ساده",
      "شهروند ساده",
      "عطار",
      "معتمد شب",
      "قاتل",
      "افشاگر",
      "ناتو",
      "محافظ",
      "روئین‌تن"
    ]
  });

  await scenario.save();
  console.log("✅ سناریو «کاپو» با موفقیت ذخیره شد");

  mongoose.disconnect();
})
.catch(err => {
  console.error("❌ خطا در اتصال یا ذخیره:", err);
});
