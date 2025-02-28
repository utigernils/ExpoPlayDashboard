import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'

@Component({
    selector: 'app-player-data',
    standalone: true,
    imports: [SidebarComponent, MatCardModule, MatIconModule, MatIconButton],
    templateUrl: './player-data.component.html',
    styleUrl: './player-data.component.scss',
})
export class PlayerDataComponent {}
