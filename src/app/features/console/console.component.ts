import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-console',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './console.component.html',
    styleUrl: './console.component.scss',
})
export class ConsoleComponent {}
