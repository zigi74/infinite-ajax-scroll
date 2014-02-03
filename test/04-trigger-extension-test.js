buster.spec.expose();

describe("IAS", function () {
  before(function() {
    this.timeout = 10000;

    window.scrollTo(0, 0);

    jQuery.ias({
      container : '.listing',
      item: '.post',
      pagination: '.navigation',
      next: '.next-posts a'
    })
  });

  after(function() {
    jQuery.ias('destroy');
  });

  it("should display a trigger", function() {
    var deferred = when.defer();

    jQuery.ias().extension(new IASTriggerExtension({
      text: 'trigger text',
      html: '<div class="ias-trigger extra-trigger-class">{text}</div>',
    }));

    expect($('.ias-trigger:visible').length).toEqual(0); // ensure it isn't already there

    scrollDown().then(function() {
      wait(500).then(function() {
        // expect the trigger to be visible
        expect($('.ias-trigger:visible').length).toEqual(1);

        // expect it not to have loaded the next page
        expect($('#post11').length).toEqual(0);

        // expect it to have the correct text, as given with the options
        expect($('.ias-trigger:visible').text()).toEqual('trigger text');

        // expect it to have the additional class as given with the options
        expect($('.ias-trigger:visible').get(0)).toHaveClassName('extra-trigger-class');

        deferred.resolve();
      });
    });

    return deferred.promise;
  });

  it("should load the next page when the trigger is clicked", function() {
    var deferred = when.defer();

    jQuery.ias().extension(new IASTriggerExtension({
      text: 'trigger text',
      html: '<div class="ias-trigger extra-trigger-class">{text}</div>',
    }));

    scrollDown().then(function() {
      wait(500).then(function() {
        $('.ias-trigger:visible').trigger('click');

        wait(2000).then(function() {
          expect($('#post11').length).toEqual(1);

          deferred.resolve();
        });
      });
    });

    return deferred.promise;
  });

  it("should display a trigger after offset", function() {
    var deferred = when.defer();

    jQuery.ias().extension(new IASTriggerExtension({
      text: 'trigger text',
      html: '<div class="ias-trigger extra-trigger-class">{text}</div>',
      offset: 2
    }));

    expect($('.ias-trigger:visible').length).toEqual(0); // ensure it isn't already there

    // scroll to page 2
    scrollDown().then(function() {
      wait(1000).then(function() {
        // expect the trigger not to be visible
        expect($('.ias-trigger:visible').length).toEqual(0);

        // expect it to have loaded the next page
        expect($('#post11').length).toEqual(1);

        // scroll to page 3
        scrollDown().then(function() {
          wait(750).then(function() {
            // expect the trigger to be visible
            expect($('.ias-trigger:visible').length).toEqual(1);

            // expect it not to have loaded the next page
            expect($('#post21').length).toEqual(0);

            deferred.resolve();
          });
        });
      });
    });

    return deferred.promise;
  });
});
