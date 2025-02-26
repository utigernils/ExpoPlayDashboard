import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-player-data',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './player-data.component.html',
    styleUrl: './player-data.component.scss',
})
export class PlayerDataComponent {}
