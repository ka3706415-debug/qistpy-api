import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon.component';
import { CITY_PAGES, CityData } from './city-data';

@Component({
  selector: 'app-city-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (city) {

      <!-- ══════ H1 for SEO ══════ -->
      <h1 class="sr-only">{{ city.metaTitle }}</h1>

      <!-- ══════ HERO ══════ -->
      <section class="bg-gradient-to-br from-primary via-primary-dark to-ink text-white"
               [attr.aria-label]="'Installment plans in ' + city.city">
        <div class="container-qp py-12 md:py-16 text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-accent mb-2">
            {{ city.city }}, {{ city.province }}
          </p>
          <h2 class="text-2xl md:text-4xl font-heading font-bold text-white leading-tight max-w-2xl mx-auto">
            {{ city.headline }}
          </h2>
          <p class="mt-3 text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {{ city.subheadline }}
          </p>
          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <a routerLink="/shop"
               class="btn-accent btn-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              Browse Products
              <app-icon name="arrow-right" [size]="16"/>
            </a>
            <a href="tel:+923288888811"
               class="btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200">
              <app-icon name="phone" [size]="16"/>
              Call Us
            </a>
          </div>

          <!-- Nearby areas pills -->
          <div class="mt-8 flex flex-wrap justify-center gap-2">
            @for (area of city.nearbyAreas; track area) {
              <span class="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/15">
                {{ area }}
              </span>
            }
          </div>
        </div>
      </section>

      <!-- ══════ HOW IT WORKS ══════ -->
      <section class="py-10 md:py-14 bg-white border-b border-border"
               [attr.aria-labelledby]="'how-heading-' + city.slug">
        <div class="container-qp">
          <div class="text-center mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Simple Process</p>
            <h2 [attr.id]="'how-heading-' + city.slug" class="text-ink">
              How to Get Installments in {{ city.city }}
            </h2>
            <p class="text-muted text-sm mt-2 max-w-lg mx-auto">
              No bank visit, no paperwork, no online payment. Just follow these steps.
            </p>
          </div>

          <div class="grid md:grid-cols-4 gap-4">
            @for (step of steps; track step.n) {
              <div class="card p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark
                             text-white grid place-items-center mx-auto mb-3 shadow-md" aria-hidden="true">
                  <app-icon [name]="step.icon" [size]="24"/>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">Step {{ step.n }}</div>
                <h3 class="text-sm font-heading font-bold text-ink">{{ step.title }}</h3>
                <p class="text-xs text-muted mt-1 leading-relaxed">{{ step.desc }}</p>
              </div>
            }
          </div>

          <div class="mt-6 card p-4 bg-success/5 border border-success/20 max-w-2xl mx-auto text-center">
            <p class="text-sm text-success font-semibold flex items-center justify-center gap-2">
              <app-icon name="shield" [size]="16"/>
              No online payment &middot; No KYC documents &middot; Agent confirms by phone
            </p>
          </div>
        </div>
      </section>

      <!-- ══════ ABOUT THIS CITY ══════ -->
      <section class="py-10 md:py-14 bg-canvas" [attr.aria-labelledby]="'about-heading-' + city.slug">
        <div class="container-qp">
          <div class="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">About</p>
              <h2 [attr.id]="'about-heading-' + city.slug" class="text-ink mb-4">
                Installment Service in {{ city.city }}
              </h2>
              @for (para of city.description; track $index) {
                <p class="text-muted text-sm leading-relaxed mb-4">{{ para }}</p>
              }
              <a routerLink="/shop"
                 class="btn-primary mt-2 inline-flex items-center gap-2">
                Browse All Products
                <app-icon name="arrow-right" [size]="14"/>
              </a>
            </div>

            <!-- Products available -->
            <div class="grid grid-cols-2 gap-3">
              @for (cat of categories; track cat.name) {
                <a [routerLink]="['/shop', cat.slug]"
                   class="card p-4 flex items-center gap-3 group hover:border-primary
                          hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary
                              flex items-center justify-center shrink-0
                              group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                       aria-hidden="true">
                    <app-icon [name]="cat.icon" [size]="20"/>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                      {{ cat.name }}
                    </div>
                    <div class="text-[11px] text-muted">On installments</div>
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- ══════ BRANCHES ══════ -->
      <section class="py-10 md:py-14" [attr.aria-labelledby]="'branches-heading-' + city.slug">
        <div class="container-qp">
          <div class="text-center mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Locations</p>
            <h2 [attr.id]="'branches-heading-' + city.slug" class="text-ink">
              Our {{ city.city }} Branch{{ city.branches.length > 1 ? 'es' : '' }}
            </h2>
            <p class="text-muted text-sm mt-2 max-w-md mx-auto">
              Walk in any time — no appointment needed. Or just call and our agent comes to you.
            </p>
          </div>

          <div class="grid gap-4" [class.md:grid-cols-1]="city.branches.length === 1" [class.max-w-lg]="city.branches.length === 1" [class.mx-auto]="city.branches.length === 1" [class.md:grid-cols-2]="city.branches.length > 1">
            @for (branch of city.branches; track branch.name) {
              <div class="card p-6 group hover:border-primary hover:shadow-lg
                          hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary
                              flex items-center justify-center shrink-0
                              group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                       aria-hidden="true">
                    <app-icon name="map-pin" [size]="22"/>
                  </div>
                  <span class="text-[11px] font-bold uppercase tracking-wide
                               bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {{ branch.area }}
                  </span>
                </div>
                <h3 class="font-heading font-bold text-ink text-base group-hover:text-primary transition-colors">
                  {{ branch.name }}
                </h3>
                <p class="text-xs text-muted mt-2 leading-relaxed flex items-start gap-1.5">
                  <app-icon name="map-pin" [size]="12" class="shrink-0 mt-0.5 text-muted"/>
                  {{ branch.address }}
                </p>
              </div>
            }
          </div>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a routerLink="/branches"
               class="btn-outline btn-md">
              <app-icon name="map-pin" [size]="14"/>
              All Branches
            </a>
            <a href="tel:+923288888811"
               class="btn-primary btn-md">
              <app-icon name="phone" [size]="14"/>
              Call Now
            </a>
          </div>
        </div>
      </section>

      <!-- ══════ PLANS STRIP ══════ -->
      <section class="py-8 bg-primary" aria-label="Installment plan options">
        <div class="container-qp">
          <p class="text-center text-xs font-bold uppercase tracking-widest text-white/60 mb-6">
            Available Plans in {{ city.city }}
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (plan of plans; track plan.months) {
              <div class="text-center bg-white/10 rounded-2xl p-4 border border-white/10
                          hover:bg-white/20 transition-colors duration-200">
                <div class="text-3xl font-heading font-bold text-white">{{ plan.months }}</div>
                <div class="text-xs text-white/70 mt-0.5">Month Plan</div>
                <div class="text-[11px] text-accent font-semibold mt-2">{{ plan.tag }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ══════ FAQ ══════ -->
      <section class="py-10 md:py-14 bg-white" [attr.aria-labelledby]="'faq-heading-' + city.slug">
        <div class="container-qp max-w-3xl">
          <div class="text-center mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">FAQ</p>
            <h2 [attr.id]="'faq-heading-' + city.slug" class="text-ink">
              Common Questions — {{ city.city }}
            </h2>
          </div>
          <div class="space-y-3">
            @for (faq of city.faqs; track faq.q) {
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

      <!-- ══════ CTA ══════ -->
      <section class="py-10 md:py-14 bg-canvas" [attr.aria-label]="'Get started in ' + city.city">
        <div class="container-qp">
          <div class="relative overflow-hidden rounded-3xl
                       bg-gradient-to-br from-primary via-primary-dark to-ink
                       p-8 md:p-12 shadow-xl text-center">
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="relative max-w-xl mx-auto text-white">
              <h2 class="text-white text-xl md:text-3xl font-heading font-bold">
                Ready to apply in {{ city.city }}?
              </h2>
              <p class="mt-2 text-white/80 text-sm md:text-base">
                Sign up, pick your product, and our {{ city.city }} agent will call you within hours.
              </p>
              <div class="mt-6 flex gap-3 justify-center flex-wrap">
                <a routerLink="/signup" class="btn-accent btn-lg shadow-lg">
                  Create Free Account
                  <app-icon name="arrow-right" [size]="16"/>
                </a>
                <a href="tel:+923288888811"
                   class="btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <app-icon name="phone" [size]="16"/>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    } @else {
      <!-- City not found -->
      <div class="container-qp py-20 text-center">
        <p class="text-muted text-sm">Page not found.</p>
        <a routerLink="/" class="btn-primary mt-4 inline-flex">Go to Homepage</a>
      </div>
    }
  `,
})
export class CityLandingComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo    = inject(PageSeoService);

  city: CityData | null = null;

  readonly steps = [
    { n: 1, title: 'Choose a Product',  desc: 'Browse mobiles, laptops, bikes and appliances on our website.',   icon: 'tag'         as const },
    { n: 2, title: 'Select a Plan',     desc: 'Pick a 3, 6, 9 or 12-month plan that fits your budget.',          icon: 'credit-card' as const },
    { n: 3, title: 'Submit Your Info',  desc: 'Fill in your name, CNIC and city. Takes less than 2 minutes.',     icon: 'user'        as const },
    { n: 4, title: 'Agent Calls You',   desc: 'Our local agent confirms the order and arranges delivery.',        icon: 'phone'       as const },
  ];

  readonly categories = [
    { name: 'Mobiles',      slug: 'mobiles',       icon: 'smartphone'    as const },
    { name: 'Laptops',      slug: 'laptops',       icon: 'laptop'        as const },
    { name: 'Bikes',        slug: 'bikes',         icon: 'bike'          as const },
    { name: 'ACs',          slug: 'acs',           icon: 'snowflake'     as const },
    { name: 'Refrigerators',slug: 'refrigerators', icon: 'refrigerator'  as const },
    { name: 'LEDs',         slug: 'leds',          icon: 'tv'            as const },
  ];

  readonly plans = [
    { months: 3,  tag: 'Best for small items'   },
    { months: 6,  tag: 'Most popular'           },
    { months: 9,  tag: 'Balanced payments'      },
    { months: 12, tag: 'Lowest monthly amount'  },
  ];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('city') ?? '';
    this.city = CITY_PAGES.find(c => c.slug === slug) ?? null;

    if (!this.city) {
      this.router.navigate(['/']);
      return;
    }

    // SEO
    this.seo.set({
      title: this.city.metaTitle,
      description: this.city.metaDescription,
      path: '/' + this.city.slug,
    });

    // LocalBusiness Schema
    this.seo.setJsonLd('local-business-' + this.city.slug, {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'QistPY ' + this.city.city,
      description: this.city.metaDescription,
      url: 'https://qistpy.com/' + this.city.slug,
      telephone: '+92 328 888 8811',
      address: {
        '@type': 'PostalAddress',
        addressLocality: this.city.city,
        addressRegion: this.city.province,
        addressCountry: 'PK',
      },
      areaServed: [this.city.city, ...this.city.nearbyAreas],
    });

    // FAQ Schema
    this.seo.setJsonLd('faq-' + this.city.slug, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.city.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
}
