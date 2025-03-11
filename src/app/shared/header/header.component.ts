import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    @Input() title: string = 'My Page Title' // Standardwert optional
}
