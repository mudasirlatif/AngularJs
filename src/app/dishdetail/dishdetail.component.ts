import { Component, OnInit, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility } from '../animations/app.animation';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
   host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
 
})
export class DishdetailComponent implements OnInit {
contactform: FormGroup;
getcomment: Comment;

dish:Dish;
dishcopy= null;

dishIds: number[];
prev: number;
next: number;
errMess: string;
visibility = 'shown';
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
    private location: Location, private fbb: FormBuilder, @Inject('BaseURL') private BaseURL) { this.createForm();}

  ngOnInit() {
     this.dishservice.getDishIds().subscribe(dishIds=> this.dishIds=dishIds, errmess => this.errMess = <any>errmess);
       this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
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
        this.dishcopy.comments.push(this.getcomment);
        this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
     this.getcomment     = this.contactform.value;
    console.log(this.getcomment);
    this.contactform.reset({
      author: '',
      comment: '',
      rating: '5'
    });
  }
}
