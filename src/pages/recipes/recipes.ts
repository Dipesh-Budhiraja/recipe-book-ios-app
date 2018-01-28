import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe';
import { RecipesService } from '../../services/recipes';
import { RecipePage } from '../recipe/recipe';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];
  constructor(private navCtrl: NavController, private recipesService: RecipesService,
              private popoverCtrl: PopoverController, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private authService: AuthService){}

  ionViewWillEnter(){
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number){
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if(!data){
          return ;
        }
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getToken()
          .then(
            (token:string) => {
              this.recipesService.fetchList(token).subscribe(
                (list: Recipe[]) => {
                  loading.dismiss();
                  if(list){
                    this.recipes = list;
                  }else{
                    this.recipes = [];
                  }
                },
                error => {
                  loading.dismiss();  
                  this.handleError(error.json().error);       
                }
              );
            }
          )
          .catch();
        }else if(data.action == 'store'){
          loading.present();
          this.authService.getActiveUser().getToken()
          .then(
            (token:string) => {
              this.recipesService.storeList(token).subscribe(
                () => {
                  loading.dismiss();
                },
                error => {
                  loading.dismiss();
                  this.handleError(error.json().error);        
                }
              );
            }
          )
          .catch();
        }
      }
    );
  }

  private handleError(errorMessage: string){
    const alert = this.alertCtrl.create({
      title: 'An error occured',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
