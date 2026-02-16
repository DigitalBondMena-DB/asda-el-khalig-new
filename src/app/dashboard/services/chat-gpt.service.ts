import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatGptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Replace this with your actual API key
  private apiKey =
    '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';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    };

    // Delay the request by 1 second
    return new Observable((observer) => {
      setTimeout(() => {
        this.http.post(this.apiUrl, body, { headers }).subscribe(
          (response) => {
            observer.next(response);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      }, 1000); // 1 second delay
    });
  }
}
