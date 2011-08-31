(function($){

    /**
     * @param options:
     *          - result: JSON Array - of key names
     *          - guess: bool - try to guess keys from 1st row
     * @param html 
     */ 
    $.fn.table2json = function(options, html) {


        var bigtable = {
            options: {},
            rawHtml: '',
            tables: [],
            definition: [],
            rows: [],

            /**
             * @param index     индекс таблицы в массиве всех таблиц
             * @param el        dom элемент таблицы
             **/
            parseTableRecursive: function (index,el)
            {
                var width = $(el).html().length;
                
                // уходим в рекурсию
                if (  $('table', el).length > 0 ){
                    $('table', el).each( bigtable.parseTableRecursive );
                }
                else
                {
                    bigtable.tables.push( $(el) );
                }
            },

            getLast: function(){
                return this.tables[ this.tables.length-1 ];
            },

            sortEm: function(){
                this.tables.sort( this.sortTables );
            },

            sortTables: function (a,b) {
                return ( a.html().length - b.html().length );
            },

            applyDefinition: function()
            {
                
                this.definition = bigtable.options.result || [];

                $("tr", this.getLast()).each( this.onRow )
            },

            onRow: function(index, tr)
            {
                var row = {};
                $("td", $(tr)).each( function(colIndex, td){
                                        //console.log(bigtable.definition, bigtable.definition[colIndex]);
                                        if ( !bigtable.definition[colIndex] && index==0 && bigtable.options && bigtable.options.guess )
                                        {
                                            bigtable.definition[colIndex] =  $(td).text();
                                        }

                                        var key =  bigtable.definition[colIndex];
                                        row[ key ] = $(td).text();
                                            
                                        
                                } );

                bigtable.rows.push( row );
            }
        };

        bigtable.options = options || { guess: true};

        $('table', html || $("body") ).each( bigtable.parseTableRecursive );
        bigtable.sortEm();
        bigtable.rows = [];
        bigtable.applyDefinition( );

	    return bigtable.rows;
    };

})(jQuery);

