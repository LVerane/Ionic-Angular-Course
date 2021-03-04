import { Injectable } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan  Mansion',
      'In the heart of New York City.',
      'https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/ulplsEcGvCMbTt21dsACDdyo5ec=/1660x934/smart/filters:no_upscale()/cloudfront-us-east-1.images.arcpublishing.com/dmn/PVG7MWFISJC7ZF4V7IC6ILZL6U.jpg',
      149.99
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://i.etsystatic.com/15022550/r/il/61876d/1245673749/il_794xN.1245673749_p6ua.jpg',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://i.pinimg.com/564x/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.99
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}
}
