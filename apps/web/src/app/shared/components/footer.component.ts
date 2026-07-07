import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-ink text-white mt-auto">
      <!-- Newsletter strip -->
      <div class="border-b border-white/10">
        <div class="container-qp py-8 md:py-10">
          <div class="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 class="text-white text-xl md:text-2xl font-heading font-bold">
                Get exclusive deals in your inbox
              </h3>
              <p class="text-white/60 text-sm mt-1">
                Weekly updates on new arrivals and special instalment offers.
              </p>
            </div>
            <form class="flex gap-2" (ngSubmit)="$event.preventDefault()">
              <label for="footer-newsletter-email" class="sr-only">Email address</label>
              <input id="footer-newsletter-email" type="email" placeholder="your@email.com" autocomplete="email"
                     class="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder:text-white/40 text-sm
                            focus:outline-none focus:border-primary focus:bg-white/15" />
              <button type="submit" class="btn-accent btn-lg shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Main footer -->
      <div class="container-qp py-12">
        <div class="grid md:grid-cols-5 gap-8">
          <!-- Brand column -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark grid place-items-center">
                <span class="text-white font-heading font-bold text-xl">Q</span>
              </div>
              <div class="font-heading font-bold text-xl">QistPY</div>
            </div>
            <p class="text-sm text-white/70 max-w-md leading-relaxed">
              Faisalabad's trusted instalment marketplace. Buy mobiles, bikes, laptops,
              and home appliances on easy monthly plans, with agent-confirmed orders
              and 100% original products.
            </p>

            <!-- Contact info -->
            <address class="mt-6 space-y-2 text-sm text-white/70 not-italic">
              <a href="tel:+923288888811" class="flex items-center gap-2 hover:text-white">
                <app-icon name="phone" [size]="14" />
                +9232 88 88 88 11
              </a>
              <a href="mailto:qistpy@gmail.com" class="flex items-center gap-2 hover:text-white">
                <app-icon name="mail" [size]="14" />
                qistpy&#64;gmail.com
              </a>
              <div class="flex items-center gap-2">
                <app-icon name="map-pin" [size]="14" />
                Faisalabad, Pakistan
              </div>
            </address>

            <!-- Social -->
            <div class="mt-5 flex items-center gap-2">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="QistPY on Facebook"
                 class="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary grid place-items-center transition-colors">
                <app-icon name="facebook" [size]="16" />
              </a>
              <a href="https://www.instagram.com/asimelectronicsofficial/" target="_blank" rel="noopener noreferrer" aria-label="QistPY on Instagram"
                 class="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary grid place-items-center transition-colors">
                <app-icon name="instagram" [size]="16" />
              </a>
              <a href="https://www.youtube.com/@asimelectronicsofficial" target="_blank" rel="noopener noreferrer" aria-label="QistPY on YouTube"
                 class="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary grid place-items-center transition-colors">
                <app-icon name="youtube" [size]="16" />
              </a>
              <a href="https://wa.me/923288888811" target="_blank" rel="noopener noreferrer" aria-label="Chat with QistPY on WhatsApp"
                 class="w-9 h-9 rounded-lg bg-white/10 hover:bg-success grid place-items-center transition-colors">
                <app-icon name="whatsapp" [size]="16" />
              </a>
            </div>
          </div>

          <!-- Shop -->
          <div>
            <h4 class="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Shop
            </h4>
            <ul class="space-y-2.5 text-sm text-white/70">
              <li><a routerLink="/shop" class="hover:text-white">All Products</a></li>
              <li><a routerLink="/shop/mobiles" class="hover:text-white">Mobiles</a></li>
              <li><a routerLink="/shop/bikes" class="hover:text-white">Bikes</a></li>
              <li><a routerLink="/shop/leds" class="hover:text-white">LEDs</a></li>
              <li><a routerLink="/shop/acs" class="hover:text-white">Air Conditioners</a></li>
              <li><a routerLink="/shop/refrigerators" class="hover:text-white">Refrigerators</a></li>
              <li><a routerLink="/shop/washing-machines" class="hover:text-white">Washing Machines</a></li>
              <li><a routerLink="/shop/microwaves" class="hover:text-white">Microwaves</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Company
            </h4>
            <ul class="space-y-2.5 text-sm text-white/70">
              <li><a routerLink="/about" class="hover:text-white">About Us</a></li>
              <li><a routerLink="/how-it-works" class="hover:text-white">How it Works</a></li>
              <li><a routerLink="/branches" class="hover:text-white">Branches</a></li>
              <li><a routerLink="/blog" class="hover:text-white">Blog</a></li>
              <li><a routerLink="/faqs" class="hover:text-white">FAQs</a></li>
              <li><a routerLink="/contact" class="hover:text-white">Contact</a></li>
              <li><a routerLink="/vendor/signup" class="hover:text-white">Sell on QistPY</a></li>
            </ul>
          </div>

          <!-- Account -->
          <div>
            <h4 class="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Account
            </h4>
            <ul class="space-y-2.5 text-sm text-white/70">
              <li><a routerLink="/login" class="hover:text-white">Login</a></li>
              <li><a routerLink="/signup" class="hover:text-white">Sign Up</a></li>
              <li><a routerLink="/account/orders" class="hover:text-white">My Orders</a></li>
              <li><a routerLink="/account/installments" class="hover:text-white">My Instalments</a></li>
              <li><a routerLink="/account/addresses" class="hover:text-white">Addresses</a></li>
            </ul>
          </div>
        </div>

        <!-- Payment methods -->
        <div class="mt-10 pt-8 border-t border-white/10">
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="text-xs text-white/60">
              Instalment payments accepted via:
              <span class="inline-flex gap-2 ml-2 flex-wrap text-white/80">
                <span class="px-2 py-1 bg-white/10 rounded text-[11px] font-semibold">Cash</span>
                <span class="px-2 py-1 bg-white/10 rounded text-[11px] font-semibold">JazzCash</span>
                <span class="px-2 py-1 bg-white/10 rounded text-[11px] font-semibold">EasyPaisa</span>
                <span class="px-2 py-1 bg-white/10 rounded text-[11px] font-semibold">Bank Transfer</span>
                <span class="px-2 py-1 bg-white/10 rounded text-[11px] font-semibold">Raast</span>
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-white/60">
              <app-icon name="shield" [size]="14" />
              Your data is kept private &amp; secure
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10 bg-black/30">
        <div class="container-qp py-4 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/50">
          <div>© {{ currentYear }} QistPY. All rights reserved.</div>
          <div class="flex gap-5">
            <a routerLink="/terms" class="hover:text-white">Terms of Service</a>
            <a routerLink="/privacy" class="hover:text-white">Privacy Policy</a>
            <a routerLink="/return-refund-policy" class="hover:text-white">Returns &amp; Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}