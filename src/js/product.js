import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";
import productModal from "./productModal.js";
import deleteModal from "./deleteModal.js";

// const { createApp } = Vue;
// let prductTitle = document.querySelector("#prduct-title").innerHTML;
let addProductModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      authURL: "https://vue3-course-api.hexschool.io/v2",
      path: "hao-ye",
      isStae: "false",
      pages: {},
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    async checkAdmin() {
      const url = `${this.authURL}/api/user/check`;

      try {
        await axios.post(url);
        this.getProducts();
      } catch (err) {
        console.log(err);
        alert(err.response.data.message);
      }
    },
    async getProducts(page = 1) {
      const url = `${this.authURL}/api/${this.path}/admin/products?page=${page}`;

      try {
        const res = await axios.get(url);
        // console.log(res);
        this.products = res.data.products;

        // 放置 回傳的pagination資料
        this.pages = res.data.pagination;
      } catch (err) {
        console.log(err);
      }
    },
    // 更新產品資料
    async updateProduct() {
      try {
        // 新增產品
        let url = `${this.authURL}/api/${this.path}/admin/product`;
        let http = "post";

        // 編輯產品
        if (!this.isStae) {
          url = `${this.authURL}/api/${this.path}/admin/product/${this.tempProduct.id}`;
          http = `put`;
        }

        const payload = { data: { ...this.tempProduct } };
        const res = await axios[http](url, payload);
        alert(res.data.message);
        addProductModal.hide();

        await this.getProducts();
      } catch (err) {
        alert(err.response.data.message);
      }
    },
    async deleteProduct() {
      try {
        const url = `${this.authURL}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        const res = await axios.delete(url);
        alert(res.data.message);
        delProductModal.hide();
        await this.getProducts();
      } catch (err) {
        alert(err.err.response.data.message);
      }
    },
    openModal(isStae, product) {
      if (isStae === "新增") {
        this.tempProduct = {
          imagesUrl: [],
        };

        // console.log(this.tempProduct);
        this.$refs.pModal.title = "新增產品";
        // prductTitle = "新增產品";
        this.isStae = true;
        // console.log(this.isStae);
        addProductModal.show();
      } else if (isStae === "編輯") {
        this.tempProduct = { ...product };
        this.$refs.pModal.title = "編輯產品";
        // prductTitle = "編輯產品";
        this.isStae = false;
        addProductModal.show();

        // console.log(this.tempProduct.imagesUrl);
        // console.log(this.isStae);
      } else if (isStae === "刪除") {
        this.tempProduct = { ...product };
        delProductModal.show();
      }
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    addProductModal = new bootstrap.Modal(
      document.querySelector("#productModal")
    );
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal")
    );

    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
    console.log(this.$refs);
  },
  components: {
    pagination,
    productModal,
    deleteModal,
  },
});

app.mount("#app");
