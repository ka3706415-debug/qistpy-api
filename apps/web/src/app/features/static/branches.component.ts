import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon.component';

interface Branch {
  name: string;
  city: string;
  address: string;
  region: 'Faisalabad' | 'Other Cities';
}

const BRANCHES: Branch[] = [
  {
    name: 'Bawachak Branch',
    city: 'Faisalabad',
    address: 'Bawachak Saim Nala, Sargodha Road, Faisalabad',
    region: 'Faisalabad',
  },
  {
    name: 'Kookiyanwala Branch',
    city: 'Faisalabad',
    address: 'Main Kookiyanwala, Near Zam Zam Sweets, Faisalabad',
    region: 'Faisalabad',
  },
  {
    name: 'Mandi Morr Branch',
    city: 'Faisalabad',
    address: 'Mandi Qatar Morr, Samundari Road, Faisalabad',
    region: 'Faisalabad',
  },
  {
    name: 'Khurriyanwala Branch',
    city: 'Faisalabad',
    address: 'Khurriyanwala Main Chowk, Near Pak Junior Public School',
    region: 'Faisalabad',
  },
  {
    name: 'Millat Chowk Branch',
    city: 'Faisalabad',
    address: 'Main Sheikhupura Road, Near Nadra Office',
    region: 'Faisalabad',
  },
  {
    name: 'Painsra Branch',
    city: 'Faisalabad',
    address: 'Near Bank Al Habib, Faisalabad Road, Painsra',
    region: 'Faisalabad',
  },
  {
    name: 'Green Town Branch',
    city: 'Faisalabad',
    address: '',
    region: 'Faisalabad',
  },
  {
    name: 'Mandi Quarter Branch',
    city: 'Faisalabad',
    address: '',
    region: 'Faisalabad',
  },
  {
    name: 'Madan Pura Branch',
    city: 'Faisalabad',
    address: '',
    region: 'Faisalabad',
  },
  {
    name: 'Jaranwala Branch',
    city: 'Jaranwala',
    address: 'Bagu Chowk, Faisalabad Road, Near Wapda Office, Jaranwala',
    region: 'Other Cities',
  },
  {
    name: 'Gojra Branch',
    city: 'Gojra',
    address: 'Near HBL Microfinance Bank, Painsra Road, Gojra',
    region: 'Other Cities',
  },
  {
    name: 'Samundari Branch',
    city: 'Samundari',
    address: 'Faisalabad Road, Near Meezan Bank, Samundari',
    region: 'Other Cities',
  },
  {
    name: 'Toba Branch',
    city: 'Toba Tek Singh',
    address: 'Hussaini Chowk, Allama Iqbal Road, Toba Tek Singh',
    region: 'Other Cities',
  },
  {
    name: 'Peer Mahal Branch',
    city: 'Toba Tek Singh',
    address: '',
    region: 'Other Cities',
  },
  {
    name: 'Shahkot Branch',
    city: 'Nankana Sahib',
    address: '',
    region: 'Other Cities',
  },
  {
    name: 'Nankana Sahib Branch',
    city: 'Nankana Sahib',
    address: '',
    region: 'Other Cities',
  },
];

const FILTERS = ['All', 'Faisalabad', 'Other Cities'] as const;

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ═══════════════════ PAGE HEADER ═══════════════════ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark border-b border-border">
      <div class="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 200 200" class="w-full h-full">
          <defs>
            <pattern id="branch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#branch-grid)" />
        </svg>
      </div>
      <div class="container-qp py-10 md:py-14 text-center relative z-10">
        <p class="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Nearby</p>
        <h1 class="text-white text-2xl md:text-3xl font-heading font-bold">QistPY Branches in Faisalabad &amp; Nearby Cities</h1>
        <p class="text-white/80 text-sm mt-2 max-w-xl mx-auto">
          {{ branchCount }} branches across Faisalabad district &amp; nearby cities — walk in
          any time, no appointment needed.
        </p>
      </div>
    </section>
    <!-- ═══════════════════ BRANCH LIST ═══════════════════ -->
    <section class="py-10 md:py-14" aria-labelledby="locations-heading">
      <div class="container-qp">
        <h2 id="locations-heading" class="text-ink text-xl md:text-2xl font-heading font-bold mb-1">Our Branch Locations</h2>
        <p class="text-xs text-muted mb-5">{{ filteredBranches().length }} branches found</p>

        <!-- ═══ FILTER TABS ═══ -->
        <div class="flex flex-wrap gap-2 mb-6">
          @for (filter of filters; track filter) {
            <button
              type="button"
              (click)="selectedRegion.set(filter)"
              class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 border"
              [class]="selectedRegion() === filter
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-border hover:border-primary hover:text-primary'"
            >
              {{ filter }} ({{ regionCounts()[filter] }})
            </button>
          }
        </div>

        @if (filteredBranches().length) {
          <div class="grid md:grid-cols-3 gap-4">
            @for (b of filteredBranches(); track b.name) {
              <div class="card p-5 group hover:border-primary hover:shadow-card-hover transition-all duration-300">
                <div class="flex items-start justify-between mb-3">
                  <div class="icon-chip bg-primary text-white w-11 h-11 shrink-0
                              group-hover:scale-105 transition-transform duration-300">
                    <app-icon name="map-pin" [size]="22"/>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {{ b.city }}
                  </span>
                </div>

                <h3 class="font-heading font-bold text-ink text-base group-hover:text-primary transition-colors">
                  {{ b.name }}
                </h3>
                @if (b.address) {
                  <p class="text-xs text-muted mt-1.5 leading-relaxed">
                    {{ b.address }}
                  </p>
                }
              </div>
            }
          </div>
        } @else {
          <div class="card p-10 text-center">
            <p class="text-sm text-muted">No branches found for this city yet. More locations are on the way.</p>
          </div>
        }
      </div>
    </section>

    <!-- ═══════════════════ CUSTOMER SUPPORT / SEO CONTENT ═══════════════════ -->
    <section class="py-10 md:py-14 bg-canvas" aria-labelledby="support-heading">
      <div class="container-qp max-w-3xl">
        <h2 id="support-heading" class="text-ink text-xl md:text-2xl font-heading font-bold mb-4">Customer Support</h2>
        <div class="prose-sm text-sm text-muted leading-relaxed space-y-4">
          <p>
            <strong class="text-ink">Find a QistPY Branch Near You</strong>
            Looking for a QistPY branch near you? We have branches across Faisalabad and nearby
            cities, which makes it easy to explore products in person, discuss instalment plans,
            complete your account verification, or simply get help with an existing order. Our
            staff at each location can walk you through mobile phones, laptops, bikes, home
            appliances and other items available on easy monthly instalments.
          </p>
          <p>
            Whether you visit our Bawachak, Khurriyanwala, Jaranwala, Gojra, Samundari, Painsra,
            Millat Chowk, Mandi Morr, Kookiyanwala, Green Town, Mandi Quarter, Madan Pura,
            Peer Mahal, Shahkot, Nankana Sahib, or Toba Tek Singh branch, you can expect the
            same friendly service and clear guidance from a team that understands the local area
            and its customers.
          </p>
          <p>
            A branch visit is useful at almost every stage of the buying process. You can come in
            to compare products before deciding, ask questions about advance payments and monthly
            amounts for 3, 6, 9 or 12-month plans, submit your CNIC for verification, or pay an
            instalment in person if you prefer not to deal with it over the phone. If something
            needs to be exchanged, repaired, or clarified after your purchase, the same branch
            network is there to support you.
          </p>
          <p>
            QistPY was built around the idea that instalment shopping shouldn't feel complicated
            or risky. There's no online payment and no hidden paperwork — everything is handled
            through a real conversation with our agents, whether that starts with a phone call or
            a walk-in visit to one of our branches. As we continue to grow, more branches will be
            added across Punjab to keep bringing this service closer to home.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ FAQ ═══════════════════ -->
    <section class="py-10 md:py-14" aria-labelledby="faq-heading">
      <div class="container-qp max-w-3xl">
        <h2 id="faq-heading" class="text-ink text-xl md:text-2xl font-heading font-bold mb-6">Frequently Asked Questions</h2>
        <div class="space-y-3">
          @for (faq of faqs; track faq.q) {
            <details class="card p-5 group cursor-pointer">
              <summary class="font-semibold text-ink text-sm flex items-center justify-between gap-3 list-none">
                {{ faq.q }}
                <app-icon name="arrow-right" [size]="14"
                          class="shrink-0 text-muted rotate-90 group-open:rotate-[270deg] transition-transform duration-200"/>
              </summary>
              <p class="text-xs text-muted mt-3 leading-relaxed">{{ faq.a }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════ CTA ═══════════════════ -->
    <section class="py-10 md:py-14">
      <div class="container-qp">
        <div class="relative overflow-hidden rounded-3xl
                     bg-gradient-to-br from-primary via-primary-dark to-ink
                     p-8 md:p-12 shadow-xl text-center">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl"></div>
          <div class="relative max-w-xl mx-auto text-white">
            <h2 class="text-white text-xl md:text-3xl font-heading font-bold">
              Can't find your nearest branch?
            </h2>
            <p class="mt-2 text-white/80 text-sm md:text-base">
              No problem! Give us a call, and our agent will be happy to assist you.
            </p>
            <div class="mt-6 flex gap-3 justify-center flex-wrap">
              <a href="tel:+923007244198" class="btn-accent btn-lg shadow-lg">
                Call Us
                <app-icon name="phone" [size]="16"/>
              </a>
              <a routerLink="/signup"
                 class="btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Create Free Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BranchesComponent implements OnInit {
  private readonly seo = inject(PageSeoService);

  readonly filters = FILTERS;
  readonly branchCount = BRANCHES.length;
  readonly selectedRegion = signal<(typeof FILTERS)[number]>('All');

  readonly faqs = [
    {
      q: 'Do I need an appointment to visit a branch?',
      a: 'No. Walk-ins are always welcome at any QistPY branch during business hours — no appointment needed.',
    },
    {
      q: 'Can I purchase products from any branch?',
      a: 'Yes. You can browse and buy any product on instalments from whichever QistPY branch is most convenient for you.',
    },
    {
      q: 'Can I pay my instalments at a branch?',
      a: 'Yes. If you prefer paying in person rather than over the phone, our branch staff can accept your monthly instalment payment directly.',
    },
    {
      q: 'What documents should I bring?',
      a: 'Please bring your original CNIC along with any supporting documents requested by our team for account verification.',
    },
    {
      q: 'Can I apply for an instalment plan at the branch?',
      a: 'Yes. Our staff can help you choose a suitable plan and complete your application on the spot during your visit.',
    },
  ];

  readonly filteredBranches = computed(() => {
    const region = this.selectedRegion();
    return region === 'All' ? BRANCHES : BRANCHES.filter((b) => b.region === region);
  });

  readonly regionCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const filter of FILTERS) {
      counts[filter] = filter === 'All' ? BRANCHES.length : BRANCHES.filter((b) => b.region === filter).length;
    }
    return counts;
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'QistPY Branches in Faisalabad & Nearby Cities',
      description: 'Find a QistPY branch near you across Faisalabad district and nearby cities including Jaranwala, Samundri, Gojra, Toba Tek Singh, Peer Mahal, Shahkot, and Nankana Sahib. Walk in any time, no appointment needed.',
      path: '/branches',
    });

    this.seo.setJsonLd('branches-schema', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: BRANCHES.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: `QistPY — ${b.name}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: b.address || undefined,
            addressLocality: b.city,
            addressRegion: 'Punjab',
            addressCountry: 'PK',
          },
        },
      })),
    });

    this.seo.setJsonLd('branches-faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
}