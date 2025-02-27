import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'

@Component({
    selector: 'app-console',
    standalone: true,
    imports: [SidebarComponent, MatCardModule, MatIcon, MatIconButton],
    templateUrl: './console.component.html',
    styleUrl: './console.component.scss',
})
export class ConsoleComponent {}
