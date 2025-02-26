import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-expo',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './expo.component.html',
    styleUrl: './expo.component.scss',
})
export class ExpoComponent {}
