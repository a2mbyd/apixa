import { isApiError } from "@apixa/core";
import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { api, type User } from "./api";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main>
      <p class="eyebrow">Apixa · Angular</p>
      <h1>Typed client in Angular</h1>
      <p class="lede">Uses <code>defineApi</code> from <code>&#64;apixa/core</code>.</p>

      <p *ngIf="error()" class="error">{{ error() }}</p>
      <p *ngIf="loading()">Loading…</p>

      <ul>
        <li *ngFor="let user of users()">
          <div>
            <strong>{{ user.name }}</strong>
            <span>{{ user.email }} · {{ user.id }}</span>
          </div>
          <button type="button" (click)="remove(user.id)">Delete</button>
        </li>
      </ul>

      <form (ngSubmit)="create()">
        <input name="name" [(ngModel)]="name" placeholder="Name" required />
        <input name="email" type="email" [(ngModel)]="email" placeholder="Email" required />
        <button type="submit">Create</button>
      </form>
    </main>
  `,
})
export class AppComponent implements OnInit {
  users = signal<User[]>([]);
  error = signal<string | null>(null);
  loading = signal(true);
  name = "";
  email = "";

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.error.set(null);
    try {
      this.users.set(await api.users.getAll());
    } catch (err) {
      this.error.set(
        isApiError(err)
          ? `${err.name}: ${err.message}. Start the FastAPI backend on :8787.`
          : "Failed to load users",
      );
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    this.error.set(null);
    try {
      await api.users.create({ name: this.name, email: this.email });
      this.name = "";
      this.email = "";
      await this.load();
    } catch (err) {
      this.error.set(isApiError(err) ? err.message : "Create failed");
    }
  }

  async remove(id: string): Promise<void> {
    this.error.set(null);
    try {
      await api.users.delete(id);
      await this.load();
    } catch (err) {
      this.error.set(isApiError(err) ? err.message : "Delete failed");
    }
  }
}
