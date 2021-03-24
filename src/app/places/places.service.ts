import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, map } from 'rxjs/operators';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan  Mansion',
      'In the heart of New York City.',
      'https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/ulplsEcGvCMbTt21dsACDdyo5ec=/1660x934/smart/filters:no_upscale()/cloudfront-us-east-1.images.arcpublishing.com/dmn/PVG7MWFISJC7ZF4V7IC6ILZL6U.jpg',
      149.99,
      new Date('2021-01-01'),
      new Date('2022-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://i.etsystatic.com/15022550/r/il/61876d/1245673749/il_794xN.1245673749_p6ua.jpg',
      189.99,
      new Date('2022-01-01'),
      new Date('2023-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://i.pinimg.com/564x/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.99,
      new Date('2021-05-01'),
      new Date('2022-10-31'),
      'abc'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id == id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    // imageUrl: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
    // userId: string
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/ulplsEcGvCMbTt21dsACDdyo5ec=/1660x934/smart/filters:no_upscale()/cloudfront-us-east-1.images.arcpublishing.com/dmn/PVG7MWFISJC7ZF4V7IC6ILZL6U.jpg',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );
    console.log(newPlace);
    this.places.pipe(take(1)).subscribe((places) => {
      this._places.next(places.concat(newPlace));
    });
  }
}
