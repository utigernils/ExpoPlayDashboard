import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class GlobalService {
    public apiUrl: string = 'https://expoplay.utigernils.ch'
}
