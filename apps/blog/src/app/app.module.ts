import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule } from 'apollo-angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { apolloProviders, langProviders } from './app.providers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ApolloModule,
    NzGridModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
  ],
  providers: [apolloProviders, langProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
