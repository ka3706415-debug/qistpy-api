import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Brand, BlogPost, Category, ProductListItem } from '../../core/models/api.models';
import { BlogService } from '../../core/services/blog.service';
import { CatalogService } from '../../core/services/catalog.service';
import { getCategorySvg } from '../../core/services/product-image.service';
import { PageSeoService } from '../../core/services/seo.service';
import { IconComponent, IconName } from '../../shared/components/icon.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';

// ── Hero slides ──────────────────────────────────────────────────────────────
interface HeroSlide {
  badge: string;
  headline: string;
  sub: string;
  cta: string;
  ctaLink: string;
  image: string;
  bg: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    badge: 'Best Seller',
    headline: 'Buy Samsung Galaxy S24 Ultra on Installment in Faisalabad',
    sub: '200MP camera, 12GB RAM, 5G — available on a 12-month plan, delivered to your door',
    cta: 'Buy Now',
    ctaLink: '/product/samsung-galaxy-s24-ultra-12-256gb',
    image: 'https://fakeimg.pl/400x400/ffffff/17307A?text=Galaxy+S24+Ultra&font=bebas',
    bg: 'linear-gradient(135deg, #2346A0 0%, #17307A 100%)',
  },
  {
    badge: 'Top Pick',
    headline: 'Buy Honda CG 125 on Installment in Faisalabad',
    sub: 'Pakistan ka sab se bharosa mand bike — 2024 model, ab easy monthly qiston par',
    cta: 'View Plans',
    ctaLink: '/product/honda-cg-125-2024',
    image: 'https://fakeimg.pl/400x400/ffffff/b91c1c?text=Honda+CG+125&font=bebas',
    bg: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
  },
  {
    badge: 'New Arrival',
    headline: 'Buy HP Victus Laptop on Installment in Faisalabad',
    sub: 'Core i7, RTX 4050 — gaming ka maza, qiston mein ada karo, no credit card required',
    cta: 'Check Price',
    ctaLink: '/product/hp-victus-gaming-core-i7-rtx-4050',
    image: 'https://fakeimg.pl/400x400/ffffff/1a1a2e?text=HP+Victus&font=bebas',
    bg: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
  },
];

// ── Special Offer slides ──────────────────────────────────────────────────────
interface OfferSlide {
  tag: string;
  title: string;
  sub: string;
  advance: string;
  monthly: string;
  months: number;
  total: string;
  image: string;
  link: string;
  bg: string;
}

const OFFER_SLIDES: OfferSlide[] = [
  {
    tag: 'Special Offer',
    title: 'iPhone 15 Pro Max on Installment in Faisalabad',
    sub: '256GB — starting from Rs 49,899 per month',
    advance: 'Rs 1,19,800', monthly: 'Rs 49,899', months: 12, total: 'Rs 7,18,588',
    image: 'https://fakeimg.pl/400x400/ffffff/1c1c1e?text=iPhone+15+Pro&font=bebas',
    link: '/shop/mobiles',
    bg: 'linear-gradient(135deg, #17307A 0%, #2346A0 100%)',
  },
  {
    tag: 'Ramadan Deal',
    title: 'Samsung 55" QLED Smart TV on Easy Instalments',
    sub: '4K QLED — perfect for your Faisalabad lounge',
    advance: 'Rs 39,800', monthly: 'Rs 16,252', months: 9, total: 'Rs 1,86,068',
    image: 'https://fakeimg.pl/400x400/ffffff/1a202c?text=Samsung+55+QLED&font=bebas',
    link: '/shop/leds',
    bg: 'linear-gradient(135deg, #0d5c63 0%, #0f766e 100%)',
  },
  {
    tag: 'Summer Deal',
    title: 'Samsung 1.5 Ton AC on Installment in Faisalabad',
    sub: 'WindFree inverter — garmi mein sukoon, bill mein farq',
    advance: 'Rs 39,800', monthly: 'Rs 16,252', months: 9, total: 'Rs 1,86,068',
    image: 'https://fakeimg.pl/400x400/ffffff/0c4a6e?text=Samsung+AC&font=bebas',
    link: '/shop/acs',
    bg: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @keyframes qp-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .qp-slide {
      animation: qp-fade-in 0.45s ease both;
    }
    @media (prefers-reduced-motion: reduce) {
      .qp-slide { animation: none; }
    }
  `],
  template: `
    <!-- ══════════════════════════════════════════════════════════
         SEO: Primary H1 hidden visually but readable by crawlers
    ══════════════════════════════════════════════════════════ -->
    <h1 class="sr-only">
      Buy Mobile on Installment in Faisalabad — Laptops, Bikes &amp; Home Appliances on Easy
      Monthly Instalments with QistPY. No credit card. No online payment. Agent-confirmed orders.
    </h1>

   <!-- ═══════════════════ SERVICE AREA NOTICE (highlighted) ═══════════════════ -->
    <div class="bg-gradient-to-r from-primary to-primary-dark text-white">
      <div class="container-qp py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div class="flex items-center gap-3 text-sm">
          <span class="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
          <span class="leading-snug">
            <strong class="font-bold">Live now in Faisalabad, Jaranwala, Gojra, Samundri, Toba Tek Singh, Peer Mahal, Shahkot &amp; Nankana Sahib</strong>
            <span class="text-white/60 mx-1.5">&middot;</span>
            <span class="text-white/85">More cities coming soon</span>
          </span>
        </div>
        <a routerLink="/branches"
           class="text-xs font-bold bg-white text-primary px-3.5 py-1.5 rounded-full shrink-0
                  flex items-center gap-1 w-fit hover:bg-white/90 transition-colors">
          Find your branch <app-icon name="arrow-right" [size]="12"/>
        </a>
      </div>
    </div>
    <!-- ═══════════════════ HERO + OFFER BANNERS ═══════════════════ -->
    <section class="bg-white border-b border-border" aria-label="Featured products and offers">
      <div class="container-qp py-5 md:py-7">
        <div class="grid md:grid-cols-2 gap-4">

          <!-- LEFT: Main Hero Carousel -->
          <div class="relative overflow-hidden rounded-2xl min-h-[260px] md:min-h-[320px]"
               role="region" aria-roledescription="carousel" aria-label="Featured products"
               [class.bg-gradient-to-br]="bannersLoading()"
               [class.from-primary]="bannersLoading()"
               [class.to-primary-dark]="bannersLoading()"
               [style.background]="!bannersLoading() && heroSlides().length ? heroSlides()[heroIdx()].bg : null">
            @if (bannersLoading()) {
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-3" aria-hidden="true">
                  <app-icon name="tag" [size]="22" class="text-white"/>
                </div>
                <h2 class="text-white font-heading font-bold text-xl md:text-2xl">Welcome to QistPy</h2>
                <p class="text-white/70 text-xs md:text-sm mt-1.5">Loading today's best instalment deals&hellip;</p>
                <div class="mt-5 flex gap-1.5" aria-hidden="true">
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:300ms"></span>
                </div>
              </div>
            } @else {
            @for (slide of heroSlides(); track $index) {
              @if ($index === heroIdx()) {
                <div class="qp-slide absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                    <svg viewBox="0 0 200 200" class="w-full h-full">
                      <defs>
                        <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#hero-grid)" />
                    </svg>
                  </div>
                  <div class="relative z-10 flex gap-4 items-center">
                    <div class="flex-1 min-w-0">
                      @if (slide.badge) {
                        <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur mb-2">
                          {{ slide.badge }}
                        </span>
                      }
                      <h2 class="text-white font-heading font-bold text-xl md:text-2xl leading-tight">
                        {{ slide.headline }}
                      </h2>
                      <p class="text-white/80 text-xs md:text-sm mt-1 max-w-xs">{{ slide.sub }}</p>
                      @if (slide.cta) {
                        <a [routerLink]="slide.ctaLink"
                           class="mt-4 inline-flex items-center gap-1.5 bg-white text-primary
                                  px-4 py-2 rounded-xl text-sm font-bold shadow-sm
                                  transition-all duration-200 hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5
                                  active:translate-y-0 focus-visible:outline focus-visible:outline-2
                                  focus-visible:outline-offset-2 focus-visible:outline-white">
                          {{ slide.cta }}
                          <app-icon name="arrow-right" [size]="14"/>
                        </a>
                      }
                    </div>
                    <div class="shrink-0 w-24 h-24 md:w-36 md:h-36">
                      <img [src]="slide.image" [alt]="slide.headline + ' — available on instalments at QistPY'"
                           width="144" height="144" class="w-full h-full object-contain drop-shadow-2xl"/>
                    </div>
                  </div>
                  <div class="relative z-10 flex gap-1.5 mt-3">
                    @for (s of heroSlides(); track $index) {
                      <button type="button"
                              (click)="heroIdx.set($index)"
                              [attr.aria-label]="'Go to slide ' + ($index + 1)"
                              [attr.aria-current]="$index === heroIdx()"
                              class="h-1.5 rounded-full transition-all cursor-pointer"
                              [class.w-5]="$index === heroIdx()"
                              [class.w-1.5]="$index !== heroIdx()"
                              [style.background]="$index === heroIdx() ? 'white' : 'rgba(255,255,255,0.4)'">
                      </button>
                    }
                  </div>
                </div>
              }
            }
            }
          </div>

          <!-- RIGHT: Special Offers Carousel -->
          <div class="relative overflow-hidden rounded-2xl min-h-[260px] md:min-h-[320px]"
               role="region" aria-roledescription="carousel" aria-label="Special offers"
               [class.bg-gradient-to-br]="bannersLoading()"
               [class.from-accent-dark]="bannersLoading()"
               [class.to-ink]="bannersLoading()"
               [style.background]="!bannersLoading() && offerSlides().length ? offerSlides()[offerIdx()].bg : null">
            @if (bannersLoading()) {
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-3" aria-hidden="true">
                  <app-icon name="badge-check" [size]="22" class="text-white"/>
                </div>
                <h2 class="text-white font-heading font-bold text-xl md:text-2xl">QistPy</h2>
                <p class="text-white/70 text-xs md:text-sm mt-1.5">Loading special offers&hellip;</p>
                <div class="mt-5 flex gap-1.5" aria-hidden="true">
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-white/70 animate-bounce" style="animation-delay:300ms"></span>
                </div>
              </div>
            } @else {
            @for (slide of offerSlides(); track $index) {
              @if ($index === offerIdx()) {
                <div class="qp-slide absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                    <svg viewBox="0 0 200 200" class="w-full h-full">
                      <rect width="100%" height="100%" fill="url(#hero-grid)"/>
                    </svg>
                  </div>
                  <div class="relative z-10 flex gap-4 items-center">
                    <div class="flex-1 min-w-0">
                      @if (slide.tag) {
                        <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur mb-2">
                          {{ slide.tag }}
                        </span>
                      }
                      <h2 class="text-white font-heading font-bold text-base md:text-xl leading-tight">{{ slide.title }}</h2>
                      <p class="text-white/80 text-xs mt-1">{{ slide.sub }}</p>
                      @if (slide.months) {
                        <div class="mt-3 bg-white/15 backdrop-blur rounded-xl p-3 space-y-1 text-xs tabular-nums">
                          <div class="flex justify-between text-white/80">
                            <span>Advance</span>
                            <span class="font-bold text-white">{{ slide.advance }}</span>
                          </div>
                          <div class="flex justify-between text-white/80">
                            <span>Monthly &times; {{ slide.months }}</span>
                            <span class="font-bold text-white">{{ slide.monthly }}</span>
                          </div>
                          <div class="flex justify-between pt-1 border-t border-white/20">
                            <span class="text-white font-semibold">Total Payable</span>
                            <span class="font-bold text-accent">{{ slide.total }}</span>
                          </div>
                        </div>
                      }
                      <a [routerLink]="slide.link"
                         class="mt-3 inline-flex items-center gap-1.5 bg-white text-primary
                                px-4 py-2 rounded-xl text-sm font-bold shadow-sm
                                transition-all duration-200 hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5
                                active:translate-y-0 focus-visible:outline focus-visible:outline-2
                                focus-visible:outline-offset-2 focus-visible:outline-white">
                        View Plan
                        <app-icon name="arrow-right" [size]="14"/>
                      </a>
                    </div>
                    <div class="shrink-0 w-20 h-20 md:w-32 md:h-32">
                      <img [src]="slide.image" [alt]="slide.title + ' instalment plan'"
                           width="128" height="128" class="w-full h-full object-contain drop-shadow-2xl"/>
                    </div>
                  </div>
                  <div class="relative z-10 flex gap-1.5 mt-3">
                    @for (s of offerSlides(); track $index) {
                      <button type="button"
                              (click)="offerIdx.set($index)"
                              [attr.aria-label]="'Go to offer ' + ($index + 1)"
                              [attr.aria-current]="$index === offerIdx()"
                              class="h-1.5 rounded-full transition-all cursor-pointer"
                              [class.w-5]="$index === offerIdx()"
                              [class.w-1.5]="$index !== offerIdx()"
                              [style.background]="$index === offerIdx() ? 'white' : 'rgba(255,255,255,0.4)'">
                      </button>
                    }
                  </div>
                </div>
              }
            }
            }
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ TRUST STRIP ═══════════════════ -->
    <section class="border-b border-border bg-white" aria-label="Why choose QistPY">
      <div class="container-qp">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          @for (p of promises; track p.label) {
            <div class="group flex items-center gap-3 py-4 px-4 md:px-6
                        transition-colors duration-200 hover:bg-primary/5">
              <div class="icon-chip bg-primary/10 text-primary w-9 h-9 shrink-0
                          transition-colors duration-200 group-hover:bg-primary group-hover:text-white" aria-hidden="true">
                <app-icon [name]="p.icon" [size]="18"/>
              </div>
              <div>
                <div class="font-semibold text-ink text-sm">{{ p.label }}</div>
                <div class="text-xs text-muted">{{ p.sub }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════ CATEGORIES ═══════════════════ -->
    <section class="py-10 md:py-14" aria-labelledby="categories-heading">
      <div class="container-qp">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Browse</p>
            <h2 id="categories-heading" class="text-ink">Shop by Category</h2>
          </div>
          <a routerLink="/shop"
             aria-label="View all installment categories"
             class="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group/link">
            View all categories <app-icon name="arrow-right" [size]="14" class="transition-transform duration-200 group-hover/link:translate-x-0.5"/>
          </a>
        </div>

        @if (categories().length) {
          <div class="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            @for (cat of categories(); track cat.id) {
              <a [routerLink]="['/shop', cat.slug]"
                 [attr.aria-label]="cat.name + ' on easy instalments'"
                 class="flex flex-col items-center gap-2 group focus-visible:outline-none">
                <div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border
                             bg-white shadow-sm group-hover:border-primary group-hover:shadow-lg
                             group-hover:shadow-primary/15 group-hover:-translate-y-1 group-hover:scale-105
                             group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2
                             transition-all duration-300 ease-out">
                  <img [src]="catImg(cat)"
                       [alt]="cat.name + ' on installment in Faisalabad'"
                       width="80" height="80"
                       (error)="onCatImgError($event, cat)"
                       class="w-full h-full object-cover"
                       loading="lazy"/>
                </div>
                <span class="text-xs font-semibold text-ink group-hover:text-primary text-center leading-tight
                             transition-colors duration-200">
                  {{ cat.name }}
                </span>
              </a>
            }
          </div>
        } @else if (loading()) {
          <div class="grid grid-cols-4 md:grid-cols-8 gap-3" aria-hidden="true">
            @for (_ of catSkeletons; track $index) {
              <div class="aspect-square rounded-2xl shimmer"></div>
            }
          </div>
        }
      </div>
    </section>

    <!-- ═══════════════════ BRAND STRIP ═══════════════════ -->
    @if (brands().length) {
      <section class="py-6 bg-canvas border-y border-border" aria-label="Top brands available on instalments">
        <div class="container-qp">
          <p class="text-[10px] font-bold uppercase tracking-widest text-muted text-center mb-4">
            Trusted Brands on Instalments
          </p>
          <div class="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
            @for (brand of brands().slice(0, 8); track brand.id) {
              <a [routerLink]="['/shop']" [queryParams]="{ brandSlug: brand.slug }"
                 [attr.aria-label]="brand.name + ' products on instalments'"
                 class="font-heading font-bold text-base md:text-xl text-muted
                        hover:text-ink transition-colors uppercase tracking-wide">
                {{ brand.name }}
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════════════════ FEATURED PRODUCTS ═══════════════════ -->
    <section class="py-10 md:py-14" aria-labelledby="trending-heading">
      <div class="container-qp">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-accent-dark mb-1">Latest</p>
            <h2 id="trending-heading" class="text-ink">Trending Products</h2>
          </div>
          <a routerLink="/shop"
             aria-label="Browse all mobiles, laptops and electronics on installment"
             class="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group/link">
            Browse all products <app-icon name="arrow-right" [size]="14" class="transition-transform duration-200 group-hover/link:translate-x-0.5"/>
          </a>
        </div>

        @if (featuredProducts().length) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product"/>
            }
          </div>
        } @else if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" aria-hidden="true">
            @for (_ of prodSkeletons; track $index) {
              <div class="card h-80 shimmer rounded-xl"></div>
            }
          </div>
        } @else if (error()) {
          <p class="card p-8 text-center text-muted text-sm">
            Products could not be loaded right now. Please refresh the page or try again shortly.
          </p>
        }
      </div>
    </section>

    <!-- ═══════════════════ HOW IT WORKS ═══════════════════ -->
    <section class="py-10 md:py-14 bg-gradient-to-br from-primary-50 via-white to-accent/5"
             aria-labelledby="how-it-works-heading">
      <div class="container-qp">
        <div class="text-center mb-10">
          <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Simple Process</p>
          <h2 id="how-it-works-heading" class="text-ink">How It Works</h2>
          <p class="text-muted text-sm mt-2 max-w-xl mx-auto">
            No payments online. Just pick a product, submit your details — our agent will call you!
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-5 relative">
          <div class="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5
                       bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" aria-hidden="true"></div>

          @for (s of steps; track s.n) {
            <div class="card p-6 text-center relative z-10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark
                           text-white grid place-items-center mx-auto mb-3 shadow-lg" aria-hidden="true">
                <app-icon [name]="s.icon" [size]="28"/>
              </div>
              <div class="badge-primary mb-2 mx-auto w-fit">Step {{ s.n }}</div>
              <h3 class="text-sm font-heading font-bold text-ink">{{ s.title }}</h3>
              <p class="text-xs text-muted mt-1.5 leading-relaxed">{{ s.desc }}</p>
            </div>
          }
        </div>

        <div class="mt-8 card p-4 bg-success/5 border border-success/30 text-center max-w-2xl mx-auto">
          <p class="flex items-center justify-center gap-2 text-sm text-success font-semibold">
            <app-icon name="shield" [size]="16"/>
            No payment online &middot; No KYC documents needed &middot; Our agent will call you
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ OUR BRANCHES ═══════════════════ -->
    <section class="py-10 md:py-14 bg-canvas" aria-labelledby="branches-heading">
      <div class="container-qp">
        <div class="text-center mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Find Us</p>
          <h2 id="branches-heading" class="text-ink">Our Branches</h2>
          <p class="text-muted text-sm mt-2 max-w-lg mx-auto">
            Walk-in branches across Faisalabad district and nearby cities — no appointment needed,
            our team is happy to help you in person.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          @for (b of featuredBranches; track b.name) {
            <article class="card p-5 group hover:border-primary hover:shadow-lg
                        hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary
                              flex items-center justify-center shrink-0
                              group-hover:bg-primary group-hover:text-white transition-colors duration-300" aria-hidden="true">
                    <app-icon name="map-pin" [size]="20"/>
                  </div>
                  <span class="text-[11px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {{ b.city }}
                  </span>
                </div>
                @if (b.status) {
                  <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                        [class.bg-success-light]="b.status === 'open'"
                        [class.text-success]="b.status === 'open'"
                        [class.bg-accent-light]="b.status === 'soon'"
                        [class.text-accent-dark]="b.status === 'soon'">
                    {{ b.status === 'open' ? 'Open' : 'Opening Soon' }}
                  </span>
                }
              </div>
              <h3 class="font-heading font-bold text-ink text-base group-hover:text-primary transition-colors leading-snug">
                {{ b.name }}
              </h3>
              <address class="text-xs text-muted mt-2 leading-relaxed not-italic">{{ b.address }}</address>
            </article>
          }
        </div>

        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a routerLink="/branches"
             class="btn-accent btn-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            View All Branches
            <app-icon name="map-pin" [size]="16"/>
          </a>
          <a href="tel:+923007244198"
             class="btn-lg bg-white border border-border text-ink hover:border-primary hover:text-primary transition-all duration-200">
            <app-icon name="phone" [size]="16"/>
            Call Us Now
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ CITIES WE SERVE ═══════════════════ -->
    <section class="py-10 md:py-14 border-t border-border" aria-labelledby="cities-heading">
      <div class="container-qp">
        <div class="text-center mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Service Area</p>
          <h2 id="cities-heading" class="text-ink">Cities We Serve</h2>
          <p class="text-muted text-sm mt-2 max-w-lg mx-auto">
            QistPY delivers on easy monthly instalments across Faisalabad district and the
            surrounding tehsils — pick your city to see local branches and delivery timelines.
          </p>
        </div>
        <nav aria-label="Cities served by QistPY">
          <ul class="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
            @for (city of citiesServed; track city.slug) {
              <li>
                <a [routerLink]="['/', city.slug]"
                   [attr.aria-label]="'Buy on installment in ' + city.name"
                   class="card flex items-center justify-center gap-2 py-3.5 px-3 text-sm font-semibold
                          text-ink hover:text-primary hover:border-primary hover:-translate-y-0.5
                          transition-all duration-200 text-center">
                  <app-icon name="map-pin" [size]="14" class="text-primary shrink-0" aria-hidden="true"/>
                  {{ city.name }}
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </section>

    <!-- ═══════════════════ SEO CONTENT (TOPICAL AUTHORITY) ═══════════════════ -->
    <section class="py-10 md:py-14 bg-canvas border-t border-border" aria-labelledby="about-heading">
      <div class="container-qp max-w-3xl">
        <article>
          <header class="text-center mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">Why QistPY</p>
            <h2 id="about-heading" class="text-ink">
              Buy Mobile on Installment in Faisalabad — the QistPY Way
            </h2>
          </header>

          <div class="prose prose-sm md:prose-base text-ink/80 space-y-5 leading-relaxed">
            <p>
              Looking to <strong>buy a mobile on installment in Faisalabad</strong> without the
              usual hassle of bank paperwork? QistPY was built for exactly that. We're a
              Faisalabad-based instalment store that lets you take home a phone, laptop, bike or
              home appliance today and pay for it in easy monthly amounts — no credit card, no
              online payment, and no trip to a bank branch. You choose a product, pick a plan,
              and our local agent handles the rest over a phone call.
            </p>

            <h3 class="text-ink font-heading font-bold text-lg">Buy Laptop on Installment</h3>
            <p>
              Students and professionals across Faisalabad can buy a laptop on installment from
              brands like HP, Dell and Lenovo, with plans stretching from 3 to 12 months. Every
              listing shows the advance payment and monthly amount upfront, so there are no
              surprises when the agent calls to confirm your order.
            </p>

            <h3 class="text-ink font-heading font-bold text-lg">Electronics &amp; Home Appliances on Installment</h3>
            <p>
              Beyond mobiles and laptops, QistPY carries LED TVs, air conditioners,
              refrigerators and other home appliances on installment — useful for families
              furnishing a new home in Faisalabad without paying the full price at once.
              Popular categories include Samsung QLED TVs and inverter ACs, both available with
              a clear breakdown of advance and monthly instalments before you commit.
            </p>

            <h3 class="text-ink font-heading font-bold text-lg">Easy Monthly Instalments, No Credit Card Needed</h3>
            <p>
              Traditional instalment plans in Pakistan usually require a credit card or a bank
              guarantor. QistPY doesn't. Because there's no online payment step either, you never
              share card details on the site — every order is confirmed by a real agent who calls
              you directly, verifies your CNIC and address, and arranges cash-on-delivery style
              collection each month.
            </p>

            <h3 class="text-ink font-heading font-bold text-lg">Local Branches &amp; Fast Approval</h3>
            <p>
              We operate walk-in branches in Faisalabad, Jaranwala and Gojra, with agent-supported
              orders also reaching Samundri, Toba Tek Singh, Peer Mahal, Shahkot and Nankana
              Sahib. Most customers get a confirmation call within a few hours of ordering, and
              approved orders are typically delivered the same or next working day — no lengthy
              credit checks or paperwork involved.
            </p>

            <h3 class="text-ink font-heading font-bold text-lg">Why Faisalabad Trusts QistPY</h3>
            <p>
              QistPY has processed thousands of instalment orders across Faisalabad district
              since launch, with a support team that speaks to customers in Urdu and English and
              follows up until delivery is complete. Every product is sourced from verified
              suppliers, every plan is shown with transparent pricing, and every order is
              confirmed by a named agent — not an automated checkout. That combination of local
              presence, transparent terms and human follow-up is what keeps customers coming back
              for their next mobile, laptop or appliance on installment.
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- ═══════════════════ TESTIMONIALS ═══════════════════ -->
    <section class="py-10 md:py-14" aria-labelledby="reviews-heading">
      <div class="container-qp">
        <div class="text-center mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-success mb-1">Customer Reviews</p>
          <h2 id="reviews-heading" class="text-ink">What Our Customers Say</h2>
          <p class="text-muted text-sm mt-2 max-w-md mx-auto">
            Real feedback from real customers across Faisalabad district.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-4">
          @for (t of testimonials; track t.name) {
            <article class="card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-1">
              <div class="flex items-center gap-0.5 text-accent mb-3"
                   [attr.aria-label]="t.rating + ' out of 5 stars'">
                @for (i of five; track i) {
                  <app-icon name="star" [size]="14"/>
                }
              </div>
              <blockquote>
                <p class="text-ink/80 text-sm leading-relaxed">&ldquo;{{ t.text }}&rdquo;</p>
              </blockquote>
              <footer class="mt-4 flex items-center gap-3 pt-4 border-t border-border">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark
                             text-white grid place-items-center font-heading font-bold text-sm shrink-0" aria-hidden="true">
                  {{ t.initial }}
                </div>
                <div>
                  <cite class="font-semibold text-ink text-sm not-italic">{{ t.name }}</cite>
                  <div class="text-xs text-muted">{{ t.city }}</div>
                </div>
              </footer>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════ BLOG TEASER ═══════════════════ -->
    @if (blogPosts().length) {
      <section class="py-10 md:py-14 bg-canvas" aria-labelledby="blog-heading">
        <div class="container-qp">
          <div class="flex items-center justify-between mb-8">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-success mb-1">Guides</p>
              <h2 id="blog-heading" class="text-ink">From the Blog</h2>
            </div>
            <a routerLink="/blog" class="text-sm font-semibold text-primary hover:underline">View all</a>
          </div>
          <div class="grid md:grid-cols-3 gap-4">
            @for (post of blogPosts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]"
                 class="card overflow-hidden group hover:border-primary hover:shadow-lg
                        hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-300">
                @if (post.coverImageUrl) {
                  <div class="aspect-[16/9] bg-white overflow-hidden">
                    <img [src]="post.coverImageUrl" [alt]="post.title + ' — QistPY installment guide'" width="400" height="225" loading="lazy"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"/>
                  </div>
                }
                <div class="p-4">
                  <h3 class="font-heading font-bold text-ink text-sm leading-snug mb-1.5">{{ post.title }}</h3>
                  <p class="text-xs text-muted line-clamp-2">{{ post.excerpt }}</p>
                </div>
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════════════════ FAQ SNIPPET (SEO) ═══════════════════ -->
    <section class="py-10 md:py-14 border-t border-border" aria-labelledby="faq-heading">
      <div class="container-qp max-w-3xl">
        <div class="text-center mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-primary mb-1">FAQ</p>
          <h2 id="faq-heading" class="text-ink">Common Questions</h2>
        </div>
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
        <div class="mt-6 text-center">
          <a routerLink="/faqs" class="text-sm font-semibold text-primary hover:underline">
            See all FAQs →
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ CTA ═══════════════════ -->
    <section class="py-10 md:py-14" aria-label="Get started with QistPY instalments">
      <div class="container-qp">
        <div class="relative overflow-hidden rounded-3xl
                     bg-gradient-to-br from-primary via-primary-dark to-ink
                     p-8 md:p-12 shadow-xl text-center">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl" aria-hidden="true"></div>
          <div class="relative max-w-xl mx-auto text-white">
            <h2 class="text-white text-xl md:text-3xl font-heading font-bold">
              Buy on Installment in Faisalabad — Get Started Today
            </h2>
            <p class="mt-2 text-white/80 text-sm md:text-base">
              Sign up in 2 minutes, pick a product and plan, and our local agent will call you —
              no credit card, no online payment, no waiting rooms.
            </p>
            <div class="mt-6 flex gap-3 justify-center flex-wrap">
              <a routerLink="/signup" class="btn-accent btn-lg shadow-lg">
                Create Free Account
                <app-icon name="arrow-right" [size]="16"/>
              </a>
              <a routerLink="/how-it-works"
                 class="btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                How it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly catalog  = inject(CatalogService);
  private readonly http     = inject(HttpClient);
  private readonly seo      = inject(PageSeoService);
  private readonly blogSvc  = inject(BlogService);

  readonly blogPosts        = signal<BlogPost[]>([]);
  readonly categories       = signal<Category[]>([]);
  readonly brands           = signal<Brand[]>([]);
  readonly featuredProducts = signal<ProductListItem[]>([]);
  readonly loading          = signal(true);
  readonly error            = signal(false);
  readonly heroIdx          = signal(0);
  readonly offerIdx         = signal(0);
  readonly bannersLoading   = signal(true);
  readonly heroSlides       = signal<HeroSlide[]>([]);
  readonly offerSlides      = signal<OfferSlide[]>([]);

  private mapHeroSlides(rows: any[]): HeroSlide[] {
    const mapped = (rows ?? []).map((s: any) => ({
      badge: s.badge, headline: s.headline, sub: s.subtitle,
      cta: s.ctaText, ctaLink: s.ctaLink,
      image: s.imageUrl || HERO_SLIDES[s.position - 1]?.image,
      bg: `linear-gradient(135deg, ${s.bgColor} 0%, ${s.bgColor}cc 100%)`,
    })).filter((s: any) => s.headline);
    return mapped.length ? mapped : HERO_SLIDES;
  }

  private mapOfferSlides(rows: any[]): OfferSlide[] {
    const mapped = (rows ?? []).map((s: any) => ({
      tag: s.badge, title: s.headline, sub: s.subtitle,
      advance: s.advance || 'Rs 25,000', monthly: s.monthly || 'Rs 8,000',
      months: s.months || 6, total: s.total || 'Rs 75,000',
      image: s.imageUrl || OFFER_SLIDES[s.position - 1]?.image,
      link: s.ctaLink || '/shop',
      bg: `linear-gradient(135deg, ${s.bgColor} 0%, ${s.bgColor}cc 100%)`,
    })).filter((s: any) => s.title);
    return mapped.length ? mapped : OFFER_SLIDES;
  }

  readonly catSkeletons  = Array.from({ length: 8 });
  readonly prodSkeletons = Array.from({ length: 8 });
  readonly five          = [1, 2, 3, 4, 5];

  private heroTimer!:  ReturnType<typeof setInterval>;
  private offerTimer!: ReturnType<typeof setInterval>;

  readonly promises: Array<{ label: string; sub: string; icon: IconName }> = [
    { label: 'Free Delivery',   sub: 'Within Faisalabad',    icon: 'truck'       },
    { label: '100% Original',   sub: 'Verified products',    icon: 'badge-check' },
    { label: 'Agent Callback',  sub: 'No online payment',    icon: 'phone'       },
    { label: 'Secure Process',  sub: 'Your data stays safe', icon: 'shield'      },
  ];

  readonly steps: Array<{ n: number; title: string; desc: string; icon: IconName }> = [
    { n: 1, title: 'Choose a Product',   desc: 'Browse any category and pick what you need.',          icon: 'tag'         },
    { n: 2, title: 'Select a Plan',      desc: 'Pick a 3, 6, 9 or 12-month payment plan.',             icon: 'credit-card' },
    { n: 3, title: 'Submit Your Info',   desc: 'Fill in your name, CNIC and city. Done!',               icon: 'user'        },
    { n: 4, title: 'Agent Calls You',    desc: 'Our team calls to confirm delivery and payment setup.', icon: 'phone'       },
  ];

  readonly citiesServed: Array<{ name: string; slug: string }> = [
    { name: 'Faisalabad',      slug: 'faisalabad' },
    { name: 'Jaranwala',       slug: 'jaranwala' },
    { name: 'Gojra',           slug: 'gojra' },
    { name: 'Samundri',        slug: 'samundri' },
    { name: 'Toba Tek Singh',  slug: 'toba-tek-singh' },
    { name: 'Nankana Sahib',   slug: 'nankana-sahib' },
  ];

  readonly featuredBranches: Array<{ name: string; city: string; address: string; status?: 'open' | 'soon' }> = [
    { name: 'Bawachak Branch',   city: 'Faisalabad', address: 'Bawachak Saim Nala, Sargodha Road, Faisalabad',             status: 'open' },
    { name: 'Jaranwala Branch',  city: 'Jaranwala',  address: 'Bagu Chowk, Faisalabad Road, Near Wapda Office, Jaranwala', status: 'open' },
    { name: 'Gojra Branch',      city: 'Gojra',      address: 'Near HBL Microfinance Bank, Painsra Road, Gojra',           status: 'open' },
  ];

  readonly testimonials = [
    {
      initial: 'A',
      name: 'Ahmed Raza',
      city: 'Faisalabad',
      rating: 5,
      text: 'The whole process was straightforward. The agent called me within an hour and sorted everything out on the spot.',
    },
    {
      initial: 'F',
      name: 'Fatima Khan',
      city: 'Jaranwala',
      rating: 5,
      text: 'I was worried about paperwork but honestly there was none. Just a quick call and the laptop arrived the next day.',
    },
    {
      initial: 'U',
      name: 'Usman Ali',
      city: 'Samundri',
      rating: 4,
      text: 'Monthly instalments fit my budget perfectly. Delivery was on time and the product was exactly as described.',
    },
  ];

  readonly faqs = [
    {
      q: 'How to buy a mobile on installment in Faisalabad?',
      a: 'Browse our mobiles category, pick a phone and a plan (3, 6, 9 or 12 months), then submit your name, CNIC and address. Our Faisalabad-based agent calls within a few hours to confirm delivery — no online payment needed.',
    },
    {
      q: 'Do I need a credit card or bank account to buy on instalments?',
      a: 'No. QistPY works without any credit card or online payment. You pay cash to our agent each month. No bank account is required to get started.',
    },
    {
      q: 'Can I buy a laptop on installment without a credit card?',
      a: 'Yes. Laptops from brands like HP, Dell and Lenovo are available on 3 to 12-month plans with no credit card and no bank guarantor — approval is based on a quick phone verification.',
    },
    {
      q: 'Which mobiles are available on installment at QistPY?',
      a: 'We stock the latest Samsung Galaxy, iPhone, Infinix, Tecno and Oppo models on installment, alongside laptops, LED TVs, ACs, refrigerators and bikes. Availability updates regularly on the mobiles category page.',
    },
    {
      q: 'Which cities does QistPY currently serve?',
      a: 'We serve Faisalabad city with walk-in branches, plus agent-supported orders reaching Jaranwala, Gojra, Samundri, Toba Tek Singh, Shahkot, Nankana Sahib and Peer Mahal. More cities are being added soon.',
    },
    {
      q: 'How long does it take to get approved for an installment plan?',
      a: 'Our agent usually calls within a few hours of your order. Once your details are confirmed over the phone, delivery is arranged the same or next working day.',
    },
    {
      q: 'What instalment plan options are available?',
      a: 'We offer 3-month, 6-month, 9-month and 12-month plans depending on the product. Each plan shows a clear advance payment and monthly amount before you apply.',
    },
    {
      q: 'Is online payment required to place an order?',
      a: 'No online payment is ever required. Every order is confirmed by phone, and monthly payments are collected in person by our agent, so your card or account details are never entered on the site.',
    },
  ];

  ngOnInit(): void {
    this.seo.set({
      title: 'Buy Mobile on Installment in Faisalabad | QistPY',
      description: 'Buy mobile, laptop, electronics & home appliances on easy monthly installments in Faisalabad — no credit card, no online payment. Fast approval, local branches. Order today!',
      path: '/',
    });

    this.seo.setJsonLd('organization-schema', {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness'],
      '@id': 'https://qistpy.com/#organization',
      name: 'QistPY',
      alternateName: 'Qist Pay',
      url: 'https://qistpy.com',
      logo: 'https://qistpy.com/assets/logo.png',
      image: 'https://qistpy.com/assets/logo.png',
      priceRange: 'Rs 5,000 - Rs 500,000',
      description: 'QistPY is a Faisalabad-based instalment marketplace for mobiles, bikes, laptops and home appliances, with easy monthly plans and no credit card required. Orders are confirmed by phone through a local agent.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bawachak Saim Nala, Sargodha Road',
        addressLocality: 'Faisalabad',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      areaServed: [
        'Faisalabad', 'Jaranwala', 'Samundri', 'Gojra',
        'Toba Tek Singh', 'Shahkot', 'Nankana Sahib', 'Peer Mahal',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+92-300-724-4198',
        contactType: 'customer service',
        availableLanguage: ['Urdu', 'English'],
        areaServed: 'PK',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        reviewCount: '312',
      },
    });

    this.seo.setJsonLd('website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://qistpy.com/#website',
      url: 'https://qistpy.com',
      name: 'QistPY',
      publisher: { '@id': 'https://qistpy.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://qistpy.com/shop?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

    this.seo.setJsonLd('breadcrumb-schema', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://qistpy.com/' },
      ],
    });

    this.seo.setJsonLd('faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });

    this.http.get<{ hero: any[]; offer: any[] }>('/banners').subscribe({
      next: (res) => {
        this.heroSlides.set(this.mapHeroSlides(res.hero));
        this.offerSlides.set(this.mapOfferSlides(res.offer));
        this.bannersLoading.set(false);
      },
      error: () => {
        this.heroSlides.set(HERO_SLIDES);
        this.offerSlides.set(OFFER_SLIDES);
        this.bannersLoading.set(false);
      },
    });

    this.heroTimer = setInterval(() => {
      const total = this.heroSlides().length;
      if (total > 0) this.heroIdx.set((this.heroIdx() + 1) % total);
    }, 5000);

    this.offerTimer = setInterval(() => {
      const total = this.offerSlides().length;
      if (total > 0) this.offerIdx.set((this.offerIdx() + 1) % total);
    }, 5000);

    this.blogSvc.list(1, 3).subscribe({
      next: (res) => this.blogPosts.set(res.data),
      error: () => {},
    });

    forkJoin({
      categories: this.catalog.listCategories(),
      brands:     this.catalog.listBrands(),
      products:   this.catalog.listProducts({ pageSize: 8, sort: 'latest' }),
    }).subscribe({
      next: ({ categories, brands, products }) => {
        this.categories.set(categories);
        this.brands.set(brands);
        this.featuredProducts.set(products.data);
        this.loading.set(false);
        this.setProductListJsonLd(products.data);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
    clearInterval(this.offerTimer);
  }

  private setProductListJsonLd(products: ProductListItem[]): void {
    if (!products?.length) return;
    const p = products as any[];
    this.seo.setJsonLd('product-list-schema', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: p.slice(0, 8).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: item.name,
          url: `https://qistpy.com/product/${item.slug}`,
          image: item.imageUrl,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: item.price,
            availability: 'https://schema.org/InStock',
            areaServed: 'Faisalabad',
          },
        },
      })),
    });
  }

  catImg(cat: Category): string {
    return cat.imageUrl || getCategorySvg(cat.name, cat.slug);
  }

  onCatImgError(event: Event, cat: Category): void {
    (event.target as HTMLImageElement).src = getCategorySvg(cat.name, cat.slug);
  }
}