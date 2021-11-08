
declare module "*.jison" {
  function parse<Node>(code: string): Node;
  export { parse }
}