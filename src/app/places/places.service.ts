import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

// new Place(
//   'p1',
//   'Manhattan  Mansion',
//   'In the heart of New York City.',
//   'https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/ulplsEcGvCMbTt21dsACDdyo5ec=/1660x934/smart/filters:no_upscale()/cloudfront-us-east-1.images.arcpublishing.com/dmn/PVG7MWFISJC7ZF4V7IC6ILZL6U.jpg',
//   149.99,
//   new Date('2021-01-01'),
//   new Date('2022-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   "L'Amour Toujours",
//   'A romantic place in Paris!',
//   'https://i.etsystatic.com/15022550/r/il/61876d/1245673749/il_794xN.1245673749_p6ua.jpg',
//   189.99,
//   new Date('2022-01-01'),
//   new Date('2023-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'The Foggy Palace',
//   'Not your average city trip!',
//   'https://i.pinimg.com/564x/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
//   99.99,
//   new Date('2021-05-01'),
//   new Date('2022-10-31'),
//   'abc'
// )

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-angular-course-c336b-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-course-c336b-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
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
    let generatedId: string;
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

    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course-c336b-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((p) => p.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course-c336b-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
