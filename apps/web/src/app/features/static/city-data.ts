export interface CityBranch {
  name: string;
  address: string;
  area: string;
}

export interface CityData {
  slug: string;
  city: string;
  province: string;
  headline: string;
  subheadline: string;
  description: string[];
  branches: CityBranch[];
  nearbyAreas: string[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  localKeywords: string[];
}

export const CITY_PAGES: CityData[] = [
  {
    slug: 'faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Faisalabad',
    subheadline: 'Mobile, Laptop, Bike & Appliance Installments — No Online Payment, Agent Comes to You',
    description: [
      'QistPY started right here in Faisalabad. If you live in the city or anywhere in the district, getting a product on installments is now as simple as picking up the phone.',
      'We have 9 branches spread across Faisalabad — from Bawachak to Millat Chowk, Mandi Quarter to Green Town. Wherever you are in the city, one of our agents is nearby and ready to help.',
      'No bank account, no credit card, no complicated paperwork. You pick the product you want, choose a 3, 6, 9 or 12-month plan, and our agent handles everything else over a phone call.',
    ],
    branches: [
      { name: 'Bawachak Branch',      area: 'Faisalabad', address: 'Bawachak Saim Nala, Sargodha Road, Faisalabad' },
      { name: 'Kookiyanwala Branch',  area: 'Faisalabad', address: 'Main Kookiyanwala, Near Zam Zam Sweets, Faisalabad' },
      { name: 'Mandi Morr Branch',    area: 'Faisalabad', address: 'Mandi Qatar Morr, Samundari Road, Faisalabad' },
      { name: 'Khurriyanwala Branch', area: 'Faisalabad', address: 'Khurriyanwala Main Chowk, Near Pak Junior Public School' },
      { name: 'Millat Chowk Branch',  area: 'Faisalabad', address: 'Main Sheikhupura Road, Near Nadra Office' },
      { name: 'Painsra Branch',       area: 'Faisalabad', address: 'Near Bank Al Habib, Faisalabad Road, Painsra' },
      { name: 'Green Town Branch',    area: 'Faisalabad', address: 'Green Town, Faisalabad' },
      { name: 'Mandi Quarter Branch', area: 'Faisalabad', address: 'Mandi Quarter, Faisalabad' },
      { name: 'Madan Pura Branch',    area: 'Faisalabad', address: 'Madan Pura, Faisalabad' },
    ],
    nearbyAreas: ['Bawachak', 'Kookiyanwala', 'Khurriyanwala', 'Painsra', 'Millat Chowk', 'Green Town', 'Mandi Morr', 'Chak Jhumra', 'Samundri Road'],
    faqs: [
      {
        q: 'Can I get a mobile on installments in Faisalabad without a credit card?',
        a: 'Yes. QistPY does not require any credit card or bank account. You pay cash to our agent every month. We currently serve all major areas of Faisalabad city and district.',
      },
      {
        q: 'Which areas of Faisalabad does QistPY cover?',
        a: 'We have 9 branches across Faisalabad including Bawachak, Kookiyanwala, Khurriyanwala, Painsra, Millat Chowk, Green Town, Mandi Morr and Madan Pura. Most parts of the city are within easy reach of one of our branches.',
      },
      {
        q: 'How long does it take to get a product delivered in Faisalabad?',
        a: 'Once your details are confirmed over the phone, most orders within Faisalabad city are delivered the same day or the next working day.',
      },
      {
        q: 'What installment plans are available in Faisalabad?',
        a: 'We offer 3, 6, 9 and 12-month plans. The advance amount and monthly payment are shown clearly before you apply. There are no hidden charges.',
      },
    ],
    metaTitle: 'Mobile, Laptop & Bike Installments in Faisalabad — QistPY',
    metaDescription: 'Get mobiles, laptops, bikes and home appliances on easy monthly installments in Faisalabad. No credit card, no bank account. 9 branches across Faisalabad. Agent confirms your order by phone.',
    localKeywords: ['installment Faisalabad', 'mobile qiston par Faisalabad', 'laptop installment Faisalabad', 'bike installment Faisalabad', 'qiston par mobile Faisalabad'],
  },

  {
    slug: 'jaranwala',
    city: 'Jaranwala',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Jaranwala',
    subheadline: 'Mobile, Laptop & Appliance Installments in Jaranwala — Cash Monthly, No Bank Account Needed',
    description: [
      'QistPY is now serving Jaranwala and the surrounding areas. If you live in Jaranwala tehsil and have been looking for a way to buy a mobile, laptop or home appliance without paying the full amount upfront, this is your answer.',
      'Our Jaranwala branch is located at Bagu Chowk on Faisalabad Road, near the Wapda Office — a central spot that most residents know well. You can walk in anytime or simply call and our agent will come to you.',
      'The process is simple — no paperwork, no bank visits, no online transactions. Pick a product from our website, choose your plan, and our agent calls you to confirm everything.',
    ],
    branches: [
      { name: 'Jaranwala Branch', area: 'Jaranwala', address: 'Bagu Chowk, Faisalabad Road, Near Wapda Office, Jaranwala' },
    ],
    nearbyAreas: ['Bagu Chowk', 'Jaranwala Chowk', 'Satiana', 'Kot Umer', 'Chak 73 GB', 'Thikriwala'],
    faqs: [
      {
        q: 'Does QistPY deliver in Jaranwala?',
        a: 'Yes. We have a branch at Bagu Chowk, Faisalabad Road, Jaranwala. Once your order is confirmed by phone, delivery is typically done the same or next working day within Jaranwala.',
      },
      {
        q: 'Can I buy a mobile on installments in Jaranwala without visiting a bank?',
        a: 'Absolutely. QistPY has no connection with any bank. You deal directly with our agent and pay cash every month. No bank account or credit card is required.',
      },
      {
        q: 'What products are available on installments in Jaranwala?',
        a: 'You can order mobiles, laptops, bikes, air conditioners, refrigerators, LEDs and other home appliances. The full product list is available on our website.',
      },
    ],
    metaTitle: 'Mobile & Appliance Installments in Jaranwala — QistPY',
    metaDescription: 'Buy mobiles, laptops and home appliances on easy installments in Jaranwala. No credit card needed. QistPY branch at Bagu Chowk, Faisalabad Road. Agent confirms your order by phone.',
    localKeywords: ['installment Jaranwala', 'mobile qiston par Jaranwala', 'laptop installment Jaranwala', 'qiston par saman Jaranwala'],
  },

  {
    slug: 'gojra',
    city: 'Gojra',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Gojra',
    subheadline: 'Mobile, Laptop & Home Appliance Installments in Gojra — No Bank, No Online Payment',
    description: [
      'People in Gojra can now buy mobiles, laptops, bikes and home appliances on easy monthly installments through QistPY. Our branch is located near HBL Microfinance Bank on Painsra Road — easy to find and easy to reach from most parts of the city.',
      'We understand that in smaller cities, trust matters more than anything else. That is why every QistPY order is confirmed through a real phone call with one of our agents — no automated systems, no confusing apps.',
      'Pick what you need from our website, apply online, and let our Gojra agent take it from there. Monthly payments are collected in cash — simple and straightforward.',
    ],
    branches: [
      { name: 'Gojra Branch', area: 'Gojra', address: 'Near HBL Microfinance Bank, Painsra Road, Gojra' },
    ],
    nearbyAreas: ['Painsra Road', 'Gojra Chowk', 'Kamalia Road', 'Toba Road', 'Ahmed Pur Sial'],
    faqs: [
      {
        q: 'Is QistPY available in Gojra?',
        a: 'Yes. QistPY has a branch in Gojra near HBL Microfinance Bank on Painsra Road. Our agent serves Gojra city and the surrounding areas.',
      },
      {
        q: 'Can I get a bike on installments in Gojra?',
        a: 'Yes. We offer bikes including Honda CG125, Yamaha and other popular models on 3 to 12-month installment plans in Gojra. No down payment requirement varies by product.',
      },
      {
        q: 'How does the installment process work in Gojra?',
        a: 'You browse and select a product on our website, choose a plan, and submit basic details. Our Gojra agent then calls you to confirm the order. Payment is in cash every month — no online transactions.',
      },
    ],
    metaTitle: 'Mobile, Bike & Appliance Installments in Gojra — QistPY',
    metaDescription: 'Easy monthly installments on mobiles, bikes and home appliances in Gojra. QistPY branch near HBL Microfinance Bank, Painsra Road. No credit card. Agent-confirmed orders.',
    localKeywords: ['installment Gojra', 'mobile qiston par Gojra', 'bike installment Gojra', 'qiston par laptop Gojra'],
  },

  {
    slug: 'samundri',
    city: 'Samundri',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Samundri',
    subheadline: 'Mobile, Laptop & Appliance Installments in Samundri — Simple Monthly Payments, No Bank Needed',
    description: [
      'QistPY is serving Samundri and nearby areas with easy installment plans on mobiles, laptops, home appliances and more. Our branch is on Faisalabad Road near Meezan Bank — a familiar landmark for most Samundri residents.',
      'Buying on installments in Samundri used to mean dealing with banks, filling forms, and waiting weeks for approval. QistPY changes that entirely. Your order is confirmed with a quick phone call and delivery is arranged shortly after.',
      'You pay in cash every month to our agent. No bank account, no credit history check, no complicated process.',
    ],
    branches: [
      { name: 'Samundri Branch', area: 'Samundri', address: 'Faisalabad Road, Near Meezan Bank, Samundri' },
    ],
    nearbyAreas: ['Samundri Chowk', 'Faisalabad Road', 'Chak Jhumra', 'Ludewala', 'Chak 96 GB'],
    faqs: [
      {
        q: 'Can I buy a mobile on installments in Samundri?',
        a: 'Yes. QistPY serves Samundri through our branch near Meezan Bank on Faisalabad Road. You can order any mobile from our website and our agent will confirm everything by phone.',
      },
      {
        q: 'How do I apply for an installment plan in Samundri?',
        a: 'Browse our website, pick your product, select a 3, 6, 9 or 12-month plan, and submit your basic details. Our Samundri agent will call you within a few hours to confirm.',
      },
      {
        q: 'Is there any documentation required in Samundri?',
        a: 'You just need your CNIC for verification. There is no need to visit a bank or submit income proof documents.',
      },
    ],
    metaTitle: 'Mobile & Appliance Installments in Samundri — QistPY',
    metaDescription: 'Get mobiles, laptops and appliances on easy monthly installments in Samundri. QistPY branch near Meezan Bank, Faisalabad Road. No bank account required. Call to apply.',
    localKeywords: ['installment Samundri', 'mobile qiston par Samundri', 'laptop installment Samundri', 'qiston par saman Samundri'],
  },

  {
    slug: 'toba-tek-singh',
    city: 'Toba Tek Singh',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Toba Tek Singh',
    subheadline: 'Mobile, Laptop & Home Appliance Installments in Toba — Agent at Your Door, Cash Monthly',
    description: [
      'QistPY now serves Toba Tek Singh and Peer Mahal through two branches in the district. Whether you are in Toba city or in Peer Mahal, our agents are nearby and ready to help you get the product you want on easy monthly installments.',
      'Our Toba branch is at Hussaini Chowk on Allama Iqbal Road — one of the busiest spots in the city. Walk in anytime or call and our agent will visit you at home.',
      'From smartphones to refrigerators to motorbikes, everything is available on 3 to 12-month plans. No online payments, no banks, no fuss.',
    ],
    branches: [
      { name: 'Toba Branch',      area: 'Toba Tek Singh', address: 'Hussaini Chowk, Allama Iqbal Road, Toba Tek Singh' },
      { name: 'Peer Mahal Branch', area: 'Peer Mahal',    address: 'Peer Mahal, Toba Tek Singh District' },
    ],
    nearbyAreas: ['Hussaini Chowk', 'Allama Iqbal Road', 'Peer Mahal', 'Rajana', 'Kamalia', 'Gojra Road'],
    faqs: [
      {
        q: 'Does QistPY serve Toba Tek Singh?',
        a: 'Yes. We have two branches in the district — one in Toba city at Hussaini Chowk and one in Peer Mahal. Both serve the surrounding areas.',
      },
      {
        q: 'Can I get a laptop on installments in Toba Tek Singh?',
        a: 'Yes. Laptops are available on 3 to 12-month plans. Our agent in Toba will confirm your order over the phone and arrange delivery to your home.',
      },
      {
        q: 'Is Peer Mahal covered by QistPY?',
        a: 'Yes. QistPY has a dedicated branch in Peer Mahal that serves the town and nearby villages. You can apply online and our agent will contact you shortly.',
      },
    ],
    metaTitle: 'Mobile & Appliance Installments in Toba Tek Singh — QistPY',
    metaDescription: 'Buy mobiles, laptops and home appliances on easy installments in Toba Tek Singh and Peer Mahal. QistPY branch at Hussaini Chowk, Toba. No credit card. Agent calls you.',
    localKeywords: ['installment Toba Tek Singh', 'mobile qiston par Toba', 'laptop installment Toba', 'qiston par saman Toba Tek Singh'],
  },

  {
    slug: 'nankana-sahib',
    city: 'Nankana Sahib',
    province: 'Punjab',
    headline: 'Easy Installment Plans in Nankana Sahib',
    subheadline: 'Mobile, Laptop & Appliance Installments in Nankana Sahib & Shahkot — Monthly Cash Payment',
    description: [
      'QistPY is now available in Nankana Sahib district with branches in both Nankana Sahib city and Shahkot. Residents across the district can now access easy installment plans on mobiles, laptops, home appliances and more.',
      'Both branches are run by local agents who understand the area and its people. Your order is confirmed through a simple phone call and payment is collected in cash every month — no online transactions, no bank visits.',
      'If you are in Nankana Sahib, Shahkot or any nearby area, you can apply on our website and our nearest agent will be in touch within a few hours.',
    ],
    branches: [
      { name: 'Nankana Sahib Branch', area: 'Nankana Sahib', address: 'Nankana Sahib City, Nankana Sahib District' },
      { name: 'Shahkot Branch',       area: 'Shahkot',       address: 'Shahkot, Nankana Sahib District' },
    ],
    nearbyAreas: ['Nankana Sahib City', 'Shahkot', 'Sangla Hill', 'Kot Rana', 'Mangtanwala'],
    faqs: [
      {
        q: 'Is QistPY available in Nankana Sahib?',
        a: 'Yes. We have a branch in Nankana Sahib city and another in Shahkot. Both serve the local area and surrounding villages.',
      },
      {
        q: 'Can I buy an AC on installments in Nankana Sahib?',
        a: 'Yes. Air conditioners are available on 3 to 12-month installment plans. Our agent will confirm your order and arrange delivery to your address in Nankana Sahib.',
      },
      {
        q: 'Does QistPY serve Shahkot as well?',
        a: 'Yes. Shahkot has a dedicated QistPY branch. Residents can apply online and our Shahkot agent will contact them to complete the order.',
      },
    ],
    metaTitle: 'Mobile & Appliance Installments in Nankana Sahib — QistPY',
    metaDescription: 'Easy monthly installments on mobiles, laptops and home appliances in Nankana Sahib and Shahkot. QistPY agent-confirmed orders. No bank account needed. Apply online today.',
    localKeywords: ['installment Nankana Sahib', 'mobile qiston par Nankana Sahib', 'Shahkot installment', 'qiston par laptop Nankana Sahib'],
  },
];