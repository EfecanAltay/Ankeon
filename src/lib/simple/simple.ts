import { PageModel } from "../core/decorators";

@PageModel("./simple.html", __dirname)
export class SimplePage {

  public FrameworkName:string = "";
  public Desc:string = "";

  constructor() {
    console.log('SimpleController initialized');
  }

  greet() {
    return 'Hello from SimpleController!';
  }
}