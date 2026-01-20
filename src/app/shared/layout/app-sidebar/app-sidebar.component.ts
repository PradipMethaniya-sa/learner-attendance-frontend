import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: string[];
};

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
})
export class AppSidebarComponent {

  // Main nav items
  navItems: NavItem[] = [
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">dashboard</span>`,
      name: "Dashboard",
      path: "/",
      roles: ["Administrator", "School Admin"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">school</span>`,
      name: "Schools",
      path: "/schools",
      roles: ["Administrator"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">person</span>`,
      name: "Students",
      path: "/students",
      roles: ["School Admin"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">group</span>`,
      name: "Guardians",
      path: "/guardians",
      roles: ["School Admin"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">badge</span>`,
      name: "Staff",
      path: "/staff",
      roles: ["School Admin"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">class</span>`,
      name: "Classes",
      path: "/classes",
      roles: ["School Admin"]
    },
    {
      icon: `<span class="material-symbols-outlined" style="font-size: 24px;">calendar_today</span>`,
      name: "Attendance",
      subItems: [
        { name: "Class Attendance", path: "/attendance/class" },
        { name: "Student Attendance", path: "/attendance/students" },
        { name: "Attendance Types", path: "/attendance/types" }
      ],
      roles: ["School Admin"]
    },
  ];
  schoolData!: any;
  userData!: any;

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.userData = this.authService.getUserData();
    this.schoolData = this.userData?.school;
    const role = this.userData?.role;
    console.log('User Role in Sidebar:', role);
    this.navItems = this.navItems.filter(item => !item.roles || item.roles.includes(role));
    console.log('Filtered Nav Items:', this.navItems);
  }

  ngOnInit() {
    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        }
      )
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
    ];

    menuGroups.forEach(group => {
      group.items.forEach((nav: NavItem, i: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem: { name: string; path: string; pro?: boolean; new?: boolean }) => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }  
}
