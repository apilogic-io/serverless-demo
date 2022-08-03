import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'blog-enum-select',
  templateUrl: './enum-select.component.html',
  styleUrls: ['./enum-select.component.less'],
})
export class EnumSelectComponent implements OnInit {
  @Input() public control!: FormControl;
  @Input() public enum!: any;
  @Input() public placeholder: string = '';
  @Input() public allowClear: boolean = true;
  @Input() public disabled: boolean = false;

  ngOnInit(): void {
    if (this.control.value !== null) {
      this._formatFormControlValue();
    }
  }

  private _formatFormControlValue(): void {
    this.control.setValue(
      Object.keys(this.enum).find((enumKey: string) => {
        return this.enum[enumKey] === this.control.value;
      })
    );
  }
}
