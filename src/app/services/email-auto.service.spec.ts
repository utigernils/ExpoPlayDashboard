import { TestBed } from '@angular/core/testing'

import { EmailAutoService } from './email-auto.service'

describe('EmailAutoService', () => {
    let service: EmailAutoService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(EmailAutoService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
