import { Component } from 'react';

import Container from './components/Container';
import SearchBar from './components/SearchBar';
import imageApi from './services/image-api';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Modal from './components/Modal';
import Loader from './components/Loader';

export default class App extends Component {
  state = {
    searchQuery: 'landscape',
    isLoading: false,
    page: 1,
    images: [],
    showModal: false,
    largeImageURL: null,
    imgTags: null,
    error: null,
  };

  componentDidMount() {
    this.fetchImages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
  }

  handleSubmitForm = query => {
    if (this.state.searchQuery === query) {
      return;
    }

    this.setState({
      searchQuery: query,
      page: 1,
      images: [],
    });
  };

  fetchImages = () => {
    const { searchQuery, page } = this.state;

    this.setState({ isLoading: true });

    imageApi({ searchQuery, page })
      .then(images => {
        if (images.length < 1) {
          this.setState({ error: true });
        } else {
          this.setState(prevState => ({
            images: [...prevState.images, ...images],
            page: prevState.page + 1,
            error: false,
          }));
          if (page !== 1) {
            this.scrollToBottom();
          }
        }
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  setImgInfo = ({ largeImageURL, tags }) => {
    this.setState({ largeImageURL, tags });
  };

  render() {
    const {
      images,
      showModal,
      largeImageURL,
      imgTags,
      isLoading,
      error,
    } = this.state;

    return (
      <Container>
        <SearchBar onSubmit={this.handleSubmitForm} />
        {error && <p>Whoops, something went wrong.</p>}
        {isLoading && <Loader />}
        <ImageGallery
          images={images}
          openModal={this.toggleModal}
          onSetImgInfo={this.setImgInfo}
        />
        {images.length > 0 && !isLoading && (
          <Button onLoadMore={this.fetchImages} />
        )}

        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={largeImageURL} alt={imgTags} />
          </Modal>
        )}
      </Container>
    );
  }
}
