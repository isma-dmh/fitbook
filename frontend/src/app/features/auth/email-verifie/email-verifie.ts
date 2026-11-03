import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/** Page vers laquelle le lien de confirmation du backend redirige (/email-verifie?statut=...). */
@Component({
  selector: 'app-email-verifie',
  imports: [RouterLink],
  templateUrl: './email-verifie.html',
  styleUrl: './email-verifie.css',

})
export class EmailVerifie {
  statut = inject(ActivatedRoute).snapshot.queryParamMap.get('statut');
}
