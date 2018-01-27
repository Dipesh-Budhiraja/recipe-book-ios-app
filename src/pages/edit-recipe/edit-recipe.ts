import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { FormArray } from '@angular/forms';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { RecipesService } from '../../services/recipes';
import { NavController } from 'ionic-angular/navigation/nav-controller';


@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;

  mode = 'New';
  constructor(private navParams: NavParams, private actionSheetController: ActionSheetController
    , private alertCtrl: AlertController, private toastCtrl: ToastController,
     private recipesService: RecipesService, public navCtrl: NavController) { }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.initializeForm();
  }

  onSubmit() {
    // console.log(this.recipeForm);
    const value = this.recipeForm.value;
    let ingredients = [];
    if(value.ingredients.length > 0){
      ingredients = value.ingredients.map(function(name){
        return {name: name, amount: 1};
      });
    }
    this.recipesService.addRecipe(value.title, value.description, value.difficulty,ingredients);
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  private initializeForm() {
    this.recipeForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'difficulty': new FormControl('Medium', Validators.required),
      'ingredients': new FormArray([])
    });
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove All Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if (len > 0) {
              for (let i = len - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All Ingredients were deleted!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
            const toast = this.toastCtrl.create({
              message: 'Item Added!',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });

  }
}
