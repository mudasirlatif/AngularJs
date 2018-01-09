import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
contactform: FormGroup;
getcomment: Comment;
dish:Dish;
dishIds: number[];
prev: number;
next: number;

formErrors = {
    'author': '',
    'comment': ''
      };
   validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, private fbb: FormBuilder) { this.createForm();}

  ngOnInit() {
     this.dishservice.getDishIds().subscribe(dishIds=> this.dishIds=dishIds);
     this.route.params
    .switchMap((params: Params)=> this.dishservice.getDish(+params['id']))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)});
  }

  createForm() {
   this.contactform = this.fbb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: '',
      comment: ['', Validators.required ]
    });
this.contactform.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
    }
onValueChanged(data?: any) {
    if (!this.contactform) { return; }
    const form = this.contactform;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
     if (data) { // Enable live preview...
            this.getcomment = data;
        }
  }

setPrevNext(dishIds: number)
{
  let index = this.dishIds.indexOf(dishIds);
  this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
  this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
}
  goBack(): void {
    this.location.back();
  }
  onSubmit()
  {
  this.getcomment.date = new Date().toString();
        this.dish.comments.push(this.getcomment);
     this.getcomment     = this.contactform.value;
    console.log(this.getcomment);
    this.contactform.reset({
      author: '',
      comment: '',
      rating: '5'
    });
  }
}
