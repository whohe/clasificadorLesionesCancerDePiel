import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo, GalleryImageOptions, GalleryPhotos } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { UserPhoto } from './UserPhoto.interface';
import { ToastController } from '@ionic/angular';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-folder',
	templateUrl: './folder.page.html',
	styleUrls: ['./folder.page.scss'],
})


export class FolderPage implements OnInit {
	public folder!: string;
	private activatedRoute = inject(ActivatedRoute);
	public images: UserPhoto[] = [];
	public imageUrl : any = "static"
	public result: any;
	constructor(private toastController: ToastController, private http: HttpClient) {}

	async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5500,
      position: 'top',
    });

    await toast.present();
	}

	takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri
		});

		this.imageUrl = image.webPath;
	};

	public async addNewToGallery() {
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100
		});
		this.images.unshift({
			webPath: capturedPhoto.webPath!
		});
	}

	async pickImages() {
		try {
			const options: GalleryImageOptions = {
				quality: 90, 
				limit: 2
			};
			var result = await Camera.pickImages(options);
			result.photos.forEach((e)=>{
				this.images.unshift({webPath: e.webPath})
			})
		} catch (error) {
			console.error('Error al seleccionar imágenes:', error);
		}
	}

	ngOnInit() {
		this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
	}

	deleteImage(index: any) {
		this.images.splice(index,1)
	}

	async blobToBase64(blob:Blob) {
	  return new Promise((resolve, _) => {
	    const reader = new FileReader();
	    reader.onloadend = () => resolve(reader.result);
	    reader.readAsDataURL(blob);
	  });
	}

	async send() {
		const formData = new FormData();
		const filepath:string = this.images[0]?.webPath ?? '';
		console.log(filepath);
		this.http.get(filepath, { responseType: 'blob' })
		.subscribe((blob) => {
			const headers = new HttpHeaders({
    		'Content-Type': 'application/json'
  		});
			this.blobToBase64(blob).then(base64 => {
  			let jsonString = {file: String(base64)}
				this.http.post('https://bcradio.sytes.net/api', jsonString, { headers: headers, withCredentials: false })
				.subscribe((response:any) => {
					this.presentToast(response.msg);
					console.log('Imagen subida correctamente:', response);
				},(error:any) => {
					console.error('Error al subir la imagen:', JSON.stringify(error));
				});
			});
  	}, error => {
    	console.error('Error fetching blob:', error);
  	});
	}
}

