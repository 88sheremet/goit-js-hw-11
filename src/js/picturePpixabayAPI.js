import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31754006-f43a1b08b2cea32f92fc299f3';
const PARAM = '&orientation=horizontal&image_type=photo&safesearch=true';

export class PictureAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.amountOfElements = 40;
  }

  async getPicture() {
    try {
      const res = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.amountOfElements}${PARAM}`
      );
      //console.log(res.data);
      this.addPage();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  addPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}