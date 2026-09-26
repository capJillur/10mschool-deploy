<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        if (Banner::exists()) {
            return;
        }

        $cdn = 'https://cdn.10minuteschool.com/images/';

        $banners = [
            ['title' => 'ঘরে বসেই দেশসেরা শিক্ষকদের ক্লাস', 'subtitle' => 'লাইভ ক্লাস, লেকচার শিট আর ২৪/৭ ডাউট সল্ভিং। ক্লাস ৬ থেকে HSC পর্যন্ত, সব এক অ্যাপে।', 'cta_label' => 'অনলাইন ব্যাচ দেখুন', 'url' => '/courses?group=academic', 'accent' => 'rose', 'image' => $cdn.'thumbnails/HSC_OB_27/hsc-2027-online-batch-science-group-thumbnail-new.png'],
            ['title' => 'IELTS-এর প্রস্তুতি Munzereen Shahid-এর সাথে', 'subtitle' => 'চারটি মডিউল, ফুল মক টেস্ট আর ব্যান্ড বাড়ানোর কৌশল, একটি কোর্সেই।', 'cta_label' => 'কোর্সটি দেখুন', 'url' => '/courses/ielts-course', 'accent' => 'sky', 'image' => $cdn.'thumbnails/IELTS_new_16_9.png'],
            ['title' => 'স্কিল শিখুন, আয় শুরু করুন', 'subtitle' => 'ফ্রিল্যান্সিং, গ্রাফিক ডিজাইন, প্রোগ্রামিং। ঘরে বসেই নিজের ক্যারিয়ার গড়ুন।', 'cta_label' => 'স্কিল কোর্স দেখুন', 'url' => '/courses?group=skills', 'accent' => 'mint', 'image' => $cdn.'thumbnails/skills_new/wordpress-course-thumbnail.jpg'],
            ['title' => 'একটি টাকাও খরচ না করে শেখা শুরু করুন', 'subtitle' => 'গ্রাফিক ডিজাইন, C প্রোগ্রামিং, কমিউনিকেশন সহ এক ডজন কোর্স সম্পূর্ণ ফ্রি।', 'cta_label' => 'ফ্রি কোর্স দেখুন', 'url' => '/courses?free=1', 'accent' => 'sun', 'image' => $cdn.'thumbnails/free-graphic-design-online-course-thumbnail.jpg'],
        ];

        foreach ($banners as $i => $b) {
            Banner::create($b + ['is_active' => true, 'sort_order' => $i]);
        }
    }
}
