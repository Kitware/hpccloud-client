// ----------------------------------------------------------------------------
// Generic methods
// ----------------------------------------------------------------------------

function callRedirect(v) {
  if (v) {
    this.redirect();
  }
}

// ----------------------------------------------------------------------------

function noOp() {}

// ----------------------------------------------------------------------------
// Decorator functions
// ----------------------------------------------------------------------------

export function anonymousRedirect(component, urlToRedirect) {
  let timoutId = 0;
  const createdFn = component.created || noOp;
  const decoratedComponent = Object.assign(
    {
      props: {},
      watch: {},
      methods: {},
    },
    component
  );

  function localCallRedirect(v) {
    if (timoutId) {
      clearTimeout(timoutId);
      timoutId = 0;
    }
    if (v) {
      this.redirect();
    }
  }

  function redirect() {
    this.$router.push(urlToRedirect);
  }

  // Add loggedOut prop
  if (!decoratedComponent.props.loggedOut) {
    decoratedComponent.props.loggedOut = {
      default: false,
      type: Boolean,
    };
  }

  // Add watch
  if (!decoratedComponent.watch.loggedOut) {
    decoratedComponent.watch.loggedOut = localCallRedirect;
  }

  // Add redirectMethod
  if (!decoratedComponent.methods.redirect) {
    decoratedComponent.methods.redirect = redirect;
  }

  // Add created lifecycle
  decoratedComponent.created = function created() {
    createdFn.call(this);
    if (this.loggedOut) {
      timoutId = setTimeout(() => {
        if (this.loggedOut) {
          this.redirect();
        }
      }, 400);
    }
  };

  return decoratedComponent;
}

// ----------------------------------------------------------------------------

export function authRedirect(component, urlToRedirect) {
  const createdFn = component.created || noOp;
  const decoratedComponent = Object.assign(
    {
      props: {},
      watch: {},
      methods: {},
    },
    component
  );

  function redirect() {
    this.$router.push(urlToRedirect);
  }

  // Add loggedIn prop
  if (!decoratedComponent.props.loggedIn) {
    decoratedComponent.props.loggedIn = {
      default: false,
      type: Boolean,
    };
  }

  // Add watch
  if (!decoratedComponent.watch.loggedIn) {
    decoratedComponent.watch.loggedIn = callRedirect;
  }

  // Add redirectMethod
  if (!decoratedComponent.methods.redirect) {
    decoratedComponent.methods.redirect = redirect;
  }

  // Add created lifecycle
  decoratedComponent.created = function created() {
    createdFn.call(this);
    if (this.loggedIn) {
      this.redirect();
    }
  };

  return decoratedComponent;
}
