import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzMenuModule,
    NzIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userName: string | null = null;
  private routerSubscription?: Subscription;
  
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  ngOnInit(): void {
    this.checkAuthentication();
    
    // Atualiza o estado de autenticação quando a rota muda
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthentication();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.tokenService.isAuthenticated();
    const user = this.tokenService.getUser();
    this.userName = user?.name || null;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isAuthenticated = false;
        this.userName = null;
        this.router.navigate(['/login']);
      },
      error: () => {
        // Mesmo se o backend falhar, limpa o localStorage e redireciona
        this.tokenService.clear();
        this.isAuthenticated = false;
        this.userName = null;
        this.router.navigate(['/login']);
      }
    });
  }
}
