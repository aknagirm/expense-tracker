import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit {
  loading = false;

  constructor(
    private loader: LoaderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoader();
  }

  checkLoader() {
    this.loader.getLoaderStatus().subscribe((status) => {
      this.loading = status;
      //this.cdRef.detectChanges();
    });
  }

  @HostListener('wheel', ['$event']) onScrollEvent(event) {
    event.preventDefault();
  }
}
