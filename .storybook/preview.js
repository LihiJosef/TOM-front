import MuiTheme from "./MuiTheme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  Story => (
    <div dir="ltr" style={{direction: "ltr"}}>
      <MuiTheme>
        <Story />
      </MuiTheme>
    </div>
  )
];
